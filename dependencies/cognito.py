from models import User
from utils.aws import CLIENT_ID, CLIENT_SECRET, POOL_ID, get_role_group, get_session
from utils.exception import ApplicationError, ApplicationException
from fastapi import Request
from mypy_boto3_cognito_idp import CognitoIdentityProviderClient
from mypy_boto3_cognito_idp.type_defs import AdminGetUserResponseTypeDef, AdminInitiateAuthResponseTypeDef, ContextDataTypeTypeDef, SignUpResponseTypeDef
import base64
import hashlib
import hmac

# Exceptions
# TODO: Consolidate common exceptions
_UNKNOWN_EXC = ApplicationException(ApplicationError(kind='UNKNOWN', message='Unknown error occurred'))

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
                UserAttributes=[
                    {
                        'Name': 'email',
                        'Value': email
                    },
                    {
                        'Name': 'given_name',
                        'Value': first_name
                    },
                    {
                        'Name': 'family_name',
                        'Value': last_name
                    },
                    {
                        'Name': 'custom:role',
                        'Value': role
                    }
                ]
            )

            self.client.admin_add_user_to_group(
                UserPoolId=POOL_ID,
                Username=response.get('UserSub'),
                GroupName=get_role_group(role)
            )

            return response
        except self.client.exceptions.UsernameExistsException:
            raise ApplicationException(ApplicationError(kind='EMAIL_EXISTS', message='Email is already in use!'))

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
            raise ApplicationException(ApplicationError(kind='CODE_INVALID', message='Invalid code provided!'))
        except self.client.exceptions.ExpiredCodeException:
            raise ApplicationException(ApplicationError(kind='CODE_EXPIRED', message='Validation code has expired, please request for a new one!'))
        except:
            raise _UNKNOWN_EXC

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
            raise ApplicationException(ApplicationError(kind='CREDENTIALS_INVALID', message='Incorrect username or password'))
        except Exception:
            raise _UNKNOWN_EXC

    async def get_user(self, user_id: str) -> AdminGetUserResponseTypeDef:
        try:
            response = self.client.admin_get_user(
                UserPoolId=POOL_ID,
                Username=user_id
            )
            return response
        except:
            raise _UNKNOWN_EXC

    async def renew_token(self, user: User, refresh_token: str, request: Request):
        try:
            response = self.client.admin_initiate_auth(
                UserPoolId=POOL_ID,
                ClientId=CLIENT_ID,
                AuthFlow='REFRESH_TOKEN_AUTH',
                AuthParameters={
                    'REFRESH_TOKEN': refresh_token,
                    'SECRET_HASH': self.__get_secret_hash(user.email)
                },
                ContextData=self.__get_request_context(request)
            )
            return response
        except self.client.exceptions.NotAuthorizedException:
            raise ApplicationException(ApplicationError(kind='CREDENTIALS_INVALID', message='Incorrect username or password'))
        except Exception:
            raise _UNKNOWN_EXC

    def __get_secret_hash(self, username: str):
        msg = username + CLIENT_ID
        digest = hmac.new(CLIENT_SECRET.encode('utf-8'), msg.encode('utf-8'), hashlib.sha256).digest()
        return base64.b64encode(digest).decode()

    def __get_request_context(self, request: Request) -> ContextDataTypeTypeDef:
        return {
            'IpAddress': request.client.host if request.client is not None else '',
            'ServerName': request.url.hostname or '',
            'ServerPath': request.url.path,
            'HttpHeaders': [{'headerName': k, 'headerValue': v} for k, v in request.headers.items()]
        }
