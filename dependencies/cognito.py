from models import User
from utils.aws import CLIENT_ID, CLIENT_SECRET, COGNITO_OAUTH_EP, POOL_ID, get_role_group, get_session
from utils.exception import Auth, Generic
from fastapi import Request
from mypy_boto3_cognito_idp import CognitoIdentityProviderClient
from mypy_boto3_cognito_idp.type_defs import AdminGetUserResponseTypeDef, AdminInitiateAuthResponseTypeDef, AttributeTypeTypeDef, ContextDataTypeTypeDef, SignUpResponseTypeDef, UserContextDataTypeTypeDef, UserTypeTypeDef
from typing import Optional, Sequence, TypedDict
import base64
import hashlib
import hmac
import requests

class CognitoOAuthTokenResponse(TypedDict):
    id_token: str
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str

class CognitoProvider:
    def __init__(self):
        self.client: CognitoIdentityProviderClient = get_session().client('cognito-idp')

    async def register_user(self, email: str, password: str, first_name: str, last_name: str, role: str) -> SignUpResponseTypeDef:
        try:
            response = self.client.sign_up(
                ClientId=CLIENT_ID,
                SecretHash=self.__get_secret_hash(email),
                Username=email,
                Password=password,
                UserAttributes=self.__construct_user_attributes(email, first_name, last_name, role)
            )
            await self._add_user_to_group(response.get('UserSub'), role)

            return response
        except self.client.exceptions.UsernameExistsException:
            raise Auth.EMAIL_EXISTS.value
        except self.client.exceptions.InvalidPasswordException:
            raise Auth.BAD_PASSWORD.value
        except:
            raise Generic.UNKNOWN.value

    async def verify_user(self, email: str, code: str):
        try:
            response = self.client.confirm_sign_up(
                ClientId=CLIENT_ID,
                SecretHash=self.__get_secret_hash(email),
                Username=email,
                ConfirmationCode=code
            )
            return response
        except self.client.exceptions.CodeMismatchException:
            raise Auth.CODE_INVALID.value
        except self.client.exceptions.ExpiredCodeException:
            raise Auth.CODE_EXPIRED.value
        except:
            raise Generic.UNKNOWN.value

    async def login_user(self, email: str, password: str, request: Request) -> AdminInitiateAuthResponseTypeDef:
        try:
            response = self.client.admin_initiate_auth(
                UserPoolId=POOL_ID,
                ClientId=CLIENT_ID,
                AuthFlow='ADMIN_USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': email,
                    'PASSWORD': password,
                    'SECRET_HASH': self.__get_secret_hash(email)
                },
                ContextData=self.__get_request_context(request)
            )
            return response
        except self.client.exceptions.NotAuthorizedException:
            raise Auth.INVALID_CREDENTIALS.value
        except Exception:
            raise Generic.UNKNOWN.value

    async def login_user_from_oauth(self, code: str, redirect_uri: str) -> CognitoOAuthTokenResponse:
        client_id_secret = base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode('utf-8')).decode()
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {client_id_secret}'
        }
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri
        }
        response = requests.post(f'{COGNITO_OAUTH_EP}/oauth2/token', data=payload, headers=headers)
        tokens: CognitoOAuthTokenResponse = response.json()
        return tokens

    async def get_user(self, user_id: str) -> Optional[AdminGetUserResponseTypeDef]:
        """
        Gets user by user ID
        User ID can either be email or the cognito:username property in the Cognito user pool
        Only Cognito native users can be retrieved by email
        Non-native users (from external providers) can only be retrieved by cognito:username property
        """
        try:
            response = self.client.admin_get_user(
                UserPoolId=POOL_ID,
                Username=user_id
            )
            return response
        except self.client.exceptions.UserNotFoundException:
            return None
        except:
            raise Generic.UNKNOWN.value

    async def find_user_by_email(self, email: str) -> Optional[UserTypeTypeDef]:
        try:
            response = self.client.list_users(
                UserPoolId=POOL_ID,
                AttributesToGet=['email', 'given_name', 'family_name'],
                Limit=1,
                Filter=f'email="{email}"'
            )
            user = response.get('Users', [])
            return user[0] if len(user) > 0 else None
        except Exception:
            raise Generic.UNKNOWN.value

    async def renew_token(self, user: User, refresh_token: str, request: Request):
        try:
            response = self.client.admin_initiate_auth(
                UserPoolId=POOL_ID,
                ClientId=CLIENT_ID,
                AuthFlow='REFRESH_TOKEN_AUTH',
                AuthParameters={
                    'REFRESH_TOKEN': refresh_token,
                    'SECRET_HASH': self.__get_secret_hash(user.username)
                },
                ContextData=self.__get_request_context(request)
            )
            return response
        except self.client.exceptions.NotAuthorizedException:
            raise Auth.INVALID_REFRESH_TOKEN.value
        except Exception:
            raise Generic.UNKNOWN.value

    async def revoke_token(self, refresh_token: str):
        try:
            self.client.revoke_token(
                Token=refresh_token,
                ClientId=CLIENT_ID,
                ClientSecret=CLIENT_SECRET
            )
        except self.client.exceptions.UnauthorizedException:
            pass
        except Exception:
            raise Generic.UNKNOWN.value

    async def set_user_email_verified(self, user: User):
        try:
            self.client.admin_update_user_attributes(
                UserPoolId=POOL_ID,
                Username=user.username,
                UserAttributes=[{'Name': 'email_verified', 'Value': 'true'}]
            )
        except Exception:
            raise Generic.UNKNOWN.value

    async def resend_confirmation_code(self, user: User):
        try:
            self.client.resend_confirmation_code(
                ClientId=CLIENT_ID,
                Username=user.username,
                SecretHash=self.__get_secret_hash(user.username)
            )
        except Exception:
            raise Generic.UNKNOWN.value

    async def request_forgot_password(self, request: Request, email: str):
        try:
            self.client.forgot_password(
                ClientId=CLIENT_ID,
                Username=email,
                SecretHash=self.__get_secret_hash(email),
                UserContextData=self.__get_request_user_context(request)
            )
        except self.client.exceptions.InvalidParameterException:
            pass
        except:
            raise Generic.UNKNOWN.value

    async def reset_forgotten_password(self, request: Request, email: str, code: str, password: str):
        try:
            self.client.confirm_forgot_password(
                ClientId=CLIENT_ID,
                SecretHash=self.__get_secret_hash(email),
                Username=email,
                ConfirmationCode=code,
                Password=password,
                UserContextData=self.__get_request_user_context(request)
            )
        except self.client.exceptions.CodeMismatchException:
            raise Auth.CODE_INVALID.value
        except self.client.exceptions.ExpiredCodeException:
            raise Auth.CODE_EXPIRED.value
        except self.client.exceptions.InvalidPasswordException:
            raise Auth.BAD_PASSWORD.value
        except:
            raise Generic.UNKNOWN.value

    async def _add_user_to_group(self, username: str, role: str):
        try:
            self.client.admin_add_user_to_group(
                UserPoolId=POOL_ID,
                Username=username,
                GroupName=get_role_group(role)
            )
        except Exception:
            raise Generic.UNKNOWN.value

    def __get_secret_hash(self, username: str):
        msg = username + CLIENT_ID
        digest = hmac.new(CLIENT_SECRET.encode('utf-8'), msg.encode('utf-8'), hashlib.sha256).digest()
        return base64.b64encode(digest).decode()

    def __get_request_user_context(self, request: Request) -> UserContextDataTypeTypeDef:
        return {
            'IpAddress': request.client.host if request.client is not None else ''
        }

    def __get_request_context(self, request: Request) -> ContextDataTypeTypeDef:
        return {
            'IpAddress': request.client.host if request.client is not None else '',
            'ServerName': request.url.hostname or '',
            'ServerPath': request.url.path,
            'HttpHeaders': [{'headerName': k, 'headerValue': v} for k, v in request.headers.items()]
        }

    def __construct_user_attributes(self, email: str, first_name: str, last_name: str, role: str) -> Sequence[AttributeTypeTypeDef]:
        return [
            {'Name': 'email', 'Value': email},
            {'Name': 'given_name', 'Value': first_name},
            {'Name': 'family_name', 'Value': last_name},
            {'Name': 'custom:role', 'Value': role}
        ]
