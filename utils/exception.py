from enum import Enum
from typing import Optional, Union

class ApplicationError:
    def __init__(self, kind: str, message: str, status_code: Union[int, None] = None):
        self.status_code = status_code or 400
        # short code
        self.kind = kind
        # long message
        self.message = message

class ApplicationException(Exception):
    def __init__(self, error: Optional[ApplicationError] = None, **kwargs):
        if error is None:
            error = ApplicationError(**kwargs)
        super().__init__(error.kind)
        self.error = error

class Generic(Enum):
    BAD_REQUEST = ApplicationException(ApplicationError(kind='BAD_REQUEST', message='Invalid request received'))
    NOT_FOUND = ApplicationException(ApplicationError(kind='NOT_FOUND', message='Entity could not be found!'))
    UNKNOWN = ApplicationException(ApplicationError(kind='UNKNOWN', message='Unknown error occurred'))

class Auth(Enum):
    BAD_PASSWORD = ApplicationException(ApplicationError(kind='BAD_PASSWORD', message='Password is too simple!'))
    CODE_EXPIRED = ApplicationException(ApplicationError(kind='CODE_EXPIRED', message='Validation code has expired, please request for a new one!'))
    CODE_INVALID = ApplicationException(ApplicationError(kind='CODE_INVALID', message='Invalid code provided!'))
    EMAIL_EXISTS = ApplicationException(ApplicationError(kind='EMAIL_EXISTS', message='Email is already in use!'))
    INVALID_CREDENTIALS = ApplicationException(ApplicationError(kind='INVALID_CREDENTIALS', message='Incorrect email or password'))
    INVALID_REFRESH_TOKEN = ApplicationException(ApplicationError(kind='INVALID_REFRESH_TOKEN', message='Incorrect refresh token'))
    UNAUTHORIZED = ApplicationException(ApplicationError(kind="UNAUTHORIZED", message="User is not authorized!", status_code=401))
