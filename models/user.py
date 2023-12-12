from typing import Literal
from ._base import BaseResponse
from pydantic import BaseModel, EmailStr, Field, SecretStr

__all__ = [
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
    role: Literal['NORMAL_USER', 'CAMPAIGN_MANAGER', 'DONATION_MANAGER', 'SUPERADMIN']
    enabled: bool
    verified: bool

class UserConfirmationCode(BaseModel):
    email: EmailStr
    code: SecretStr

class UserRegistrationResponse(BaseResponse):
    confirmation_medium: str

class UserRefreshToken(BaseModel):
    refresh_token: str

class UserToken(UserRefreshToken):
    access_token: str

class TokenResponse(BaseResponse, UserToken):
    pass
