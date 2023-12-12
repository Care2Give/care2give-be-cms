from .cognito import CognitoProvider
from models import User
from utils.aws import decode_cognito_token, get_role_group
from utils.exception import ApplicationError, ApplicationException
from fastapi import Cookie, Header
from mypy_boto3_cognito_idp.type_defs import AdminGetUserResponseTypeDef
from typing import Annotated, Union

DEFAULT_ROLE = 'NORMAL_USER'
KEYS = {}
_UNAUTHORIZED_EXC = ApplicationException(ApplicationError(kind="UNAUTHORIZED", message="User is not authorized!", status_code=401))

class AuthPolicy:
    def __init__(self, user: Union[AdminGetUserResponseTypeDef, User]):
        if type(user) == dict:
            attributes = dict([(a.get('Name'), a.get('Value')) for a in user.get('UserAttributes')])
            kwargs = {
                'username': user.get('Username'),
                'email': attributes.get('email'),
                'first_name': attributes.get('given_name'),
                'last_name': attributes.get('family_name'),
                'enabled': user.get('Enabled'),
                'verified': user.get('UserStatus') == 'CONFIRMED',
                'role': user.get('custom:role', 'NORMAL_USER'),
                'password': ''
            }
            self.user = User(**kwargs)
            return
        self.user: User = user

    def is_superadmin(self):
        return self.user.role == 'SUPERADMIN'

    def is_campaign_manager(self):
        return self.user.role in ['SUPERADMIN', 'CAMPAIGN_MANAGER']

    def is_donation_manager(self):
        return self.user.role in ['SUPERADMIN', 'DONATION_MANAGER']

    def get_user(self):
        return self.user

    def get_user_group(self):
        return get_role_group(self.get_user().role)

    @classmethod
    async def get_authenticated_user(cls, session: Annotated[Union[str, None], Cookie()] = None) -> User:
        if session is None:
            raise _UNAUTHORIZED_EXC

        try:
            decoded = decode_cognito_token(session)
            if decoded is None:
                raise _UNAUTHORIZED_EXC
            cognito = CognitoProvider()
            user_details = await cognito.get_user(decoded.get('sub'))
            auth_policy = AuthPolicy(user_details)
            user = auth_policy.get_user()
        except Exception:
            raise _UNAUTHORIZED_EXC
        return user

    @classmethod
    async def get_authorized_user(cls, session: Annotated[Union[str, None], Cookie()] = None, authorization: Annotated[Union[str, None], Header()] = None):
        if authorization is None or not authorization.startswith('Bearer '):
            raise _UNAUTHORIZED_EXC
        try:
            authorization = authorization[7:]
            decoded = decode_cognito_token(authorization, False)
            if decoded is None:
                raise _UNAUTHORIZED_EXC
        except:
            raise _UNAUTHORIZED_EXC

        user = await cls.get_authenticated_user(session)
        return cls(user)
