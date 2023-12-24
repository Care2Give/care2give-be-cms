# care2give-be-cms

## Setup

Python version: `3.10.6`
Use `pyenv` to install the correct version.

## Terraform

Terraform scripts have been written to setup the required infrastructure on Amazon to support features in this application.

#### Terraform Environment Variables

The terraform scripts require some valid Amazon and Google credentials for the scripts to work

```bash
export TF_VAR_google_client_id=*GOOGLE_OAUTH_CLIENT_ID*
export TF_VAR_google_client_secret=*GOOGLE_OAUTH_CLIENT_SECRET*
# AWS IAM User with AmazonCognitoPowerUser, AWSLambda_FullAccess, IAMFullAccess and additional permission for 'lambda:CreateFunction'
export TF_VAR_aws_access_key=*IAM_USER_ACCESS_KEY_ID*
export TF_VAR_aws_secret_key=*IAM_USER_SECRET_KEY*
```

To obtain the relevant Google credentials, see [this](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id).

## Before Running the Application

#### Application Environment Variables

The application requires a few environment variables to be set to operate correctly

```bash
# Amazon Cognito Application integration backend credentials
export AWS_COGNITO_POOL_ID=*POOL_ID*
export AWS_COGNITO_CLIENT_ID=*CLIENT_ID*
export AWS_COGNITO_CLIENT_SECRET=*SECRET*
# AWS IAM user assigned with care2give_backend_api policy permissions.
# care2give_backend_api is automatically created as part of terraform
# though the user itself is not automatically created
export AWS_ACCESS_KEY_ID=*IAM_USER_ACCESS_KEY_ID*
export AWS_SECRET_ACCESS_KEY=*IAM_USER_SECRET_KEY*
export AWS_DEFAULT_REGION=ap-southeast-1
```

Values surrounded by `*` should be replaced with the appropriate actual values.

#### Code Changes

Next, in the `utils/constants.py`, set the appropriate values for the constants.

```python
# No slashes after port portion, port not
# required if using standard HTTP(S) port
SERVER_URI=https://uri_without_path:8000
```

## Running the application

```bash
poetry install  # install dependencies
# Development server requires SSL key / certicate pair
uvicorn main:app --ssl-certfile cert.pem --ssl-keyfile key.pem --reload # start server
```

Note: Start application from same directory as `main.py`!

API documentation may be accessed at `/docs`.
