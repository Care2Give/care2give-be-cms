from typing import Optional
import boto3

client = boto3.client('cognito-idp')

def lambda_handler(event, _):
    details = get_req_details(event)
    if details['trigger_source'] != 'PreSignUp_ExternalProvider':
        return event

    pool_id = details['pool_id']
    email = details['email']
    native_user = get_user(pool_id, email)
    if native_user is None:
        first_name = details['given_name']
        last_name = details.get('family_name')
        role = details.get('custom:role', 'NORMAL_USER')
        client.admin_create_user(
            UserPoolId=pool_id,
            Username=email,
            UserAttributes=construct_user_attributes(email, first_name, last_name, role),
            MessageAction='SUPPRESS'
        )
        native_user = get_user(pool_id, email)

    [provider_name, uid] = get_provider_name_uid(details['username'])
    client.admin_link_provider_for_user(
        UserPoolId=pool_id,
        SourceUser={
            'ProviderName': provider_name,
            'ProviderAttributeName': 'Cognito_Subject',
            'ProviderAttributeValue': uid
        },
        DestinationUser={
            'ProviderName': 'Cognito',
            'ProviderAttributeValue': native_user['Username']
        }
    )
    return event

def construct_user_attributes(email: str, first_name: str, last_name: Optional[str], role: str):
    attributes = [
        {'Name': 'email', 'Value': email},
        {'Name': 'given_name', 'Value': first_name},
        {'Name': 'family_name', 'Value': last_name},
        {'Name': 'custom:role', 'Value': role}
    ]
    return [x for x in attributes if type(x['Value']) == str]

def get_provider_name_uid(external_username: str):
    return external_username.split('_', 1)

def get_user(pool_id: str, email: str):
    try:
        response = client.admin_get_user(
            UserPoolId=pool_id,
            Username=email
        )
        return response
    except client.exceptions.UserNotFoundException:
        return None

def get_req_details(event):
    request = event['request']
    user_attributes = request.get('userAttributes')
    details = {
        **user_attributes,
        'trigger_source': event['triggerSource'],
        'pool_id': event['userPoolId'],
        'username': event['userName']
    }
    return details
