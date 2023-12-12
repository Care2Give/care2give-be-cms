from typing import Annotated
from dependencies.auth_policy import DEFAULT_ROLE, AuthPolicy
from dependencies.cognito import CognitoProvider
from models import BaseResponse, UserRegistrationDetails, UserRegistrationResponse, UserConfirmationCode, UserLoginDetails, TokenResponse, User, UserRefreshToken
from fastapi import APIRouter, Depends, Request, Response

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

@router.post('/register')
async def register(user_registration: UserRegistrationDetails, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]) -> UserRegistrationResponse:
    response = await cognito.register_user(
        user_registration.email, user_registration.password.get_secret_value(),
        user_registration.first_name, user_registration.last_name, DEFAULT_ROLE
    )
    return UserRegistrationResponse(status="SUCCESS", confirmation_medium=response['CodeDeliveryDetails'].get('DeliveryMedium', 'UNKNOWN'))

@router.post('/verify')
async def verify_user(user_confirmation: UserConfirmationCode, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]) -> BaseResponse:
    await cognito.verify_user(user_confirmation.email, user_confirmation.code.get_secret_value())
    return BaseResponse(status="SUCCESS")

@router.post('/login')
async def login(request: Request, user_details: UserLoginDetails, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)], response: Response) -> TokenResponse:
    result = await cognito.login_user(user_details.email, user_details.password.get_secret_value(), request)
    authentication_result = result.get('AuthenticationResult')
    response.set_cookie('session', authentication_result.get('IdToken', ''))
    return TokenResponse(
        status="SUCCESS",
        access_token=authentication_result.get('AccessToken', ''),
        refresh_token=authentication_result.get('RefreshToken', '')
    )

@router.post('/refresh')
async def refresh_token(request: Request, authed: Annotated[AuthPolicy, Depends(AuthPolicy.get_authorized_user)], details: UserRefreshToken, cognito: Annotated[CognitoProvider, Depends(CognitoProvider)]):
    response = await cognito.renew_token(authed.get_user(), details.refresh_token, request)
    return BaseResponse(status="SUCCESS")


@router.get('/authorized')
async def check_authorized(authed: Annotated[AuthPolicy, Depends(AuthPolicy.get_authorized_user)]):
    return authed.get_user()
