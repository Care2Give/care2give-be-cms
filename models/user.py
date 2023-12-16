from ._base import BaseResponse
from mypy_boto3_cognito_idp.type_defs import AdminGetUserResponseTypeDef
from pydantic import BaseModel, EmailStr, Field, SecretStr
from typing import Literal, Optional

__all__ = [
    'AccessTokenResponse',
    'TokenResponse',
    'User',
    'UserConfirmationCode',
    'UserLoginDetails',
    'UserRefreshToken',
    'UserRegistrationDetails',
    'UserRegistrationResponse'
]

class UserLoginDetails(BaseModel):
    email: EmailStr
    password: SecretStr

class UserRegistrationDetails(UserLoginDetails):
    first_name: str
    last_name: str

class User(UserRegistrationDetails):
    password: SecretStr = Field(exclude=True)
    username: str = Field(exclude=True)
    last_name: Optional[str]
    role: Literal['NORMAL_USER', 'CAMPAIGN_MANAGER', 'DONATION_MANAGER', 'SUPERADMIN']
    enabled: bool
    verified: bool

    @classmethod
    def from_cognito(cls, user_details: AdminGetUserResponseTypeDef):
        attributes = dict([(a.get('Name'), a.get('Value')) for a in user_details.get('UserAttributes')])
        kwargs = {
            'username': user_details.get('Username'),
            'email': attributes.get('email'),
            'first_name': attributes.get('given_name'),
            'last_name': attributes.get('family_name'),
            'enabled': user_details.get('Enabled'),
            'verified': user_details.get('email_verified') == 'true',
            'role': user_details.get('custom:role', 'NORMAL_USER'),
            'password': ''
        }
        return cls(**kwargs)

# TODO: User confirmation should use a UUID rather than email as identifier
class UserConfirmationCode(BaseModel):
    email: EmailStr
    code: SecretStr

class UserRegistrationResponse(BaseResponse):
    confirmation_medium: str

class UserRefreshToken(BaseModel):
    refresh_token: str

class UserAccessToken(BaseModel):
    access_token: str

class AccessTokenResponse(BaseResponse, UserAccessToken):
    pass

class TokenResponse(BaseResponse):
    access_token: str
    refresh_token: str
