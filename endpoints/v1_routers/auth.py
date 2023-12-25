from models import BaseResponse, UserRegistrationDetails, UserRegistrationResponse, UserConfirmationCode, UserLoginDetails, User, UserRefreshToken, UserLoginEmail, UserPasswordResetConfirmationCode
from utils.aws import construct_cognito_oauth_url
from utils.constants import SERVER_URI
from utils.exception import Auth, Generic
from dependencies.auth_policy import DEFAULT_ROLE, AuthPolicy
from dependencies.cognito import CognitoProvider
from enum import Enum
from datetime import datetime, timedelta, UTC
from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.responses import RedirectResponse
from googleapiclient import discovery
from starlette.requests import Request
from typing import Annotated, Optional
import google_auth_oauthlib.flow

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

class AuthCookieType(Enum):
    SESSION = 'session'
    ACCESS = 'access'
    REFRESH = 'refresh'

def set_auth_cookie(response: Response, cookie_type: AuthCookieType, id_token: str):
    httponly = cookie_type != AuthCookieType.ACCESS
    expires = datetime.now(UTC)
    if cookie_type == AuthCookieType.SESSION:
        expires += timedelta(minutes=180)
    elif cookie_type == AuthCookieType.ACCESS:
        expires += timedelta(minutes=15)
    elif cookie_type == AuthCookieType.REFRESH:
        expires += timedelta(days=3)
    response.set_cookie(cookie_type.value, id_token, httponly=httponly, samesite='strict', expires=expires)

def unset_auth_cookies(response: Response):
    response.set_cookie(AuthCookieType.SESSION.value, '', httponly=True, samesite='strict', max_age=0)
    response.set_cookie(AuthCookieType.REFRESH.value, '', httponly=True, samesite='strict', max_age=0)
    response.set_cookie(AuthCookieType.ACCESS.value, '', samesite='strict', max_age=0)

def get_cognito_oauth_callback_url():
    return f'{SERVER_URI}/api/v1{router.url_path_for("oauth_callback_cognito")}'

@router.post('/register')
async def register(user_registration: UserRegistrationDetails, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]) -> UserRegistrationResponse:
    response = await cognito.register_user(
        user_registration.email, user_registration.password.get_secret_value(),
        user_registration.first_name, user_registration.last_name, DEFAULT_ROLE
    )
    return UserRegistrationResponse(status='SUCCESS', confirmation_medium=response['CodeDeliveryDetails'].get('DeliveryMedium', 'UNKNOWN'))

@router.post('/verify')
async def verify_user(user_confirmation: UserConfirmationCode, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]) -> BaseResponse:
    await cognito.verify_user(user_confirmation.email, user_confirmation.code.get_secret_value())
    return BaseResponse(status='SUCCESS')

@router.post('/login')
async def login(request: Request, user_details: UserLoginDetails, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], response: Response) -> BaseResponse:
    result = await cognito.login_user(user_details.email, user_details.password.get_secret_value(), request)
    authentication_result = result.get('AuthenticationResult')
    set_auth_cookie(response, AuthCookieType.SESSION, authentication_result.get('IdToken', ''))
    set_auth_cookie(response, AuthCookieType.ACCESS, authentication_result.get('AccessToken', ''))
    set_auth_cookie(response, AuthCookieType.REFRESH, authentication_result.get('RefreshToken', ''))
    return BaseResponse(status='SUCCESS')

@router.get('/login/google')
async def login_google():
    url = construct_cognito_oauth_url('Google', get_cognito_oauth_callback_url())
    return RedirectResponse(url)

@router.post('/refresh')
async def refresh_token(request: Request, user: Annotated[User, Depends(AuthPolicy.get_authenticated_user)], details: UserRefreshToken, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], response: Response) -> BaseResponse:
    result = await cognito.renew_token(user, details.refresh_token, request)
    authentication_result = result.get('AuthenticationResult')
    set_auth_cookie(response, AuthCookieType.SESSION, authentication_result.get('IdToken', ''))
    set_auth_cookie(response, AuthCookieType.ACCESS, authentication_result.get('AccessToken', ''))
    return BaseResponse(status='SUCCESS')

@router.get('/authorized')
async def check_authorized(authed: Annotated[AuthPolicy, Depends(AuthPolicy.get_authorized_user)]):
    return authed.get_user()

@router.get('/oauth2/callback/cognito')
async def oauth_callback_cognito(request: Request, response: Response, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], code: Optional[str] = None):
    if code is None:
        raise Generic.BAD_REQUEST.value
    tokens = await cognito.login_user_from_oauth(code, f'{request.url.scheme}://{request.url.netloc}{request.url.path}')
    user = await AuthPolicy.get_authenticated_user(tokens.get('id_token'))
    if not user.verified:
        # We trust the external provider to be
        # an attester that user has control of email
        await cognito.set_user_email_verified(user)
        await cognito._add_user_to_group(user.username, user.role)

    set_auth_cookie(response, AuthCookieType.SESSION, tokens.get('id_token', ''))
    set_auth_cookie(response, AuthCookieType.ACCESS, tokens.get('access_token', ''))
    set_auth_cookie(response, AuthCookieType.REFRESH, tokens.get('refresh_token', ''))
    response.status_code = 307
    response.headers['location'] = f'{request.url.scheme}://{request.url.netloc}'
    return BaseResponse(status='SUCCESS')

@router.get('/signout')
async def signout(response: Response, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], session: Annotated[Optional[str], Cookie()] = None):
    if session is None:
        raise Auth.UNAUTHORIZED.value

    try:
        await cognito.revoke_token(session)
    except:
        # Ignore errors, refresh token likely already invalid
        pass

    unset_auth_cookies(response)
    return BaseResponse(status="SUCCESS")

@router.post('/forgot-password', description='''
    Sends a corresponding request to Cognito to initiate the forgot password flow for a user.<br>
    User will be sent a confirmation code via their prefered contact medium if the user exists.<br>
    If user does not exist, this endpoint will still respond with a success to prevent the endpoint from being used to enumerate usernames.
''')
async def request_forgot_password(request: Request, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], details: UserLoginEmail):
    await cognito.request_forgot_password(request, details.email)
    return BaseResponse(status='SUCCESS')

@router.post('/reset-password')
async def reset_password(request: Request, details: UserPasswordResetConfirmationCode, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]):
    await cognito.reset_forgotten_password(request, details.email, details.code.get_secret_value(), details.password.get_secret_value())
    return BaseResponse(status='SUCCESS')

# --- START - FOR KEEPSAKE ---
def get_google_oauth_redirect_uri():
    return f'{SERVER_URI}/api/v1{router.url_path_for("oauth_callback_google")}'

def is_google_scope_valid(scopes_str: str):
    scopes = scopes_str.split(' ')
    return 'email' in scopes and 'profile' in scopes and 'openid' in scopes

# @router.get('/login/google')
async def _login_google():
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=['openid', 'email', 'profile']
    )
    flow.redirect_uri = get_google_oauth_redirect_uri()
    authorization_url, _ = flow.authorization_url(include_granted_scopes='true')
    return RedirectResponse(authorization_url)

# @router.get('/oauth2/callback/google')
async def oauth_callback_google(request: Request, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], state: Optional[str] = None, scope: Optional[str] = None, code: Optional[str] = None):
    if state is None or code is None or scope is None:
        raise Generic.BAD_REQUEST.value
    if not is_google_scope_valid(scope):
        raise Generic.UNKNOWN.value
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=None,
        state=state
    )
    flow.redirect_uri = get_google_oauth_redirect_uri()
    flow.fetch_token(authorization_response=request.url.__str__())
    credentials = flow.credentials
    oauth_client = discovery.build('oauth2', 'v2', credentials=credentials)
    user_info = oauth_client.userinfo().get().execute()

    email = user_info.get('email')
    if not email:
        raise Generic.UNKNOWN.value

    user = await cognito.find_user_by_email(email)
    return BaseResponse(status='SUCCESS')
# --- END - FOR KEEPSAKE ---
