from typing import Union

class ApplicationError:
    def __init__(self, kind: str, message: str, status_code: Union[int, None] = None):
        self.status_code = status_code or 400
        # short code
        self.kind = kind
        # long message
        self.message = message

class ApplicationException(Exception):
    def __init__(self, error: ApplicationError):
        super().__init__(error.kind)
        self.error = error
