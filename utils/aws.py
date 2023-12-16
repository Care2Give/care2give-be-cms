from jwt.algorithms import RSAAlgorithm
from typing import Literal, Union
from urllib.parse import urlencode
import boto3
import json
import jwt
import os
import requests

SESSION: Union[boto3.Session, None] = None
REGION_NAME = os.environ.get('AWS_DEFAULT_REGION')
POOL_ID = os.environ.get('AWS_COGNITO_POOL_ID') or ''
CLIENT_ID = os.environ.get('AWS_COGNITO_CLIENT_ID') or ''
CLIENT_SECRET = os.environ.get('AWS_COGNITO_CLIENT_SECRET') or ''
KEYS_URL = 'https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json'.format(REGION_NAME, POOL_ID)

COGNITO_OAUTH_EP = ''
KEYS = {}

def get_session() -> boto3.Session:
    global SESSION
    if SESSION is None:
        session_opts = {}
        session_opts['aws_access_key_id'] = os.environ.get('AWS_ACCESS_KEY_ID')
        session_opts['aws_secret_access_key'] = os.environ.get('AWS_SECRET_ACCESS_KEY')
        session_opts['region_name'] = REGION_NAME
        SESSION = boto3.Session(**session_opts)
    return SESSION

def get_signing_keys():
    global KEYS
    response = requests.get(KEYS_URL)
    keys = json.loads(response.content).get('keys', {})
    KEYS = {}
    for key in keys:
        KEYS[key['kid']] = key
    return KEYS

def decode_cognito_token(raw_token: str, is_identity=True):
    token = jwt.get_unverified_header(raw_token)
    kid = token.get('kid')
    if kid is None:
        return None

    key = KEYS.get(kid)
    if key is None:
        signing_keys = get_signing_keys()
        key = signing_keys.get(kid)

    if key is None:
        return None

    pub_key = RSAAlgorithm.from_jwk(key)
    if is_identity:
        decoded = jwt.decode(raw_token, pub_key, algorithms=['RS256'], audience=CLIENT_ID)
    else:
        decoded = jwt.decode(raw_token, pub_key, algorithms=['RS256'])
    return decoded

def construct_cognito_oauth_url(provider: Literal['Google'], redirect_uri: str):
    params = urlencode({
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': 'email openid profile',
        'redirect_uri': redirect_uri,
        'identity_provider': provider
    })
    return f'{COGNITO_OAUTH_EP}/oauth2/authorize?{params}'

ROLE_GROUP_MAP = {
    'SUPERADMIN': 'superadmins',
    'NORMAL_USER': 'normal_users',
    'DONATION_MANAGER': 'donation_managers',
    'CAMPAIGN_MANAGER': 'campaign_managers'
}

def get_role_group(role: str):
    return ROLE_GROUP_MAP[role]

# Force init
def init():
    global COGNITO_OAUTH_EP
    if COGNITO_OAUTH_EP == '':
        client = get_session().client('cognito-idp')
        pool_info = client.describe_user_pool(UserPoolId=POOL_ID).get('UserPool')
        if pool_info.get('CustomDomain'):
            # TODO: To be implemented
            pass
        elif pool_info.get('Domain'):
            domain = pool_info.get('Domain')
            COGNITO_OAUTH_EP = f'https://{domain}.auth.{REGION_NAME}.amazoncognito.com'

if __name__ != '__main__':
    init()
