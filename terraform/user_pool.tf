resource "aws_cognito_user_pool" "care2give" {
  name                     = "care2give"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  mfa_configuration        = "OPTIONAL"

  software_token_mfa_configuration {
    enabled = true
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  lambda_config {
    pre_sign_up = aws_lambda_function.presignup_hook.arn
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = true
    developer_only_attribute = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                     = "given_name"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = true
    developer_only_attribute = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                     = "family_name"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = false
    developer_only_attribute = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }

  schema {
    name                     = "role"
    attribute_data_type      = "String"
    mutable                  = true
    required                 = false
    developer_only_attribute = false
    string_attribute_constraints {
      min_length = 1
      max_length = 2048
    }
  }
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.care2give.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "openid profile email"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
  }

  attribute_mapping = {
    username    = "sub"
    email       = "email"
    given_name  = "given_name"
    family_name = "family_name"
  }
}

resource "aws_cognito_user_pool_domain" "care2give" {
  domain       = "care2give"
  user_pool_id = aws_cognito_user_pool.care2give.id
}

resource "aws_cognito_user_pool_client" "client" {
  name                          = "Care2Give BE CMS"
  user_pool_id                  = aws_cognito_user_pool.care2give.id
  generate_secret               = true
  explicit_auth_flows           = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_ADMIN_USER_PASSWORD_AUTH"]
  access_token_validity         = 15
  id_token_validity             = 180
  refresh_token_validity        = 3
  prevent_user_existence_errors = "ENABLED"
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
  callback_urls                        = [format("%s%s", var.server_uri, var.oauth_callback_path)]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "profile", "email"]
  supported_identity_providers         = ["Google"]
  depends_on = [
    aws_cognito_identity_provider.google
  ]
}

resource "aws_iam_policy" "user_policy" {
  name = "care2give_backend_api"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
        {
            "Effect" : "Allow",
            "Action" : [
                "cognito-idp:AdminAddUserToGroup",
                "cognito-idp:AdminDisableUser",
                "cognito-idp:AdminEnableUser",
                "cognito-idp:AdminGetUser",
                "cognito-idp:AdminInitiateAuth",
                "cognito-idp:AdminRemoveUserFromGroup",
                "cognito-idp:AdminRespondToAuthChallenge",
                "cognito-idp:AdminUpdateUserAttributes",
                "cognito-idp:ChangePassword",
                "cognito-idp:ConfirmForgotPassword",
                "cognito-idp:ConfirmSignUp",
                "cognito-idp:DescribeUserPool",
                "cognito-idp:ForgotPassword",
                "cognito-idp:GlobalSignOut",
                "cognito-idp:ListGroups",
                "cognito-idp:ListUsers",
                "cognito-idp:ListUsersInGroup",
                "cognito-idp:ResendConfirmationCode",
                "cognito-idp:RevokeToken",
                "cognito-idp:SignUp"
            ],
            "Resource" : "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/${aws_cognito_user_pool.care2give.id}"
      }
    ]
  })
}
// Precedence is lower better by default.
// Set higher privilege to higher precedence to favour
// lower privilege level more if multiple groups are
// assigned to a single user

resource "aws_cognito_user_group" "superadmins" {
  name         = "superadmins"
  user_pool_id = aws_cognito_user_pool.care2give.id
  description  = "Superadmin Users"
  precedence   = 99
}

resource "aws_cognito_user_group" "donation_managers" {
  name         = "donation_managers"
  user_pool_id = aws_cognito_user_pool.care2give.id
  description  = "Donation Managers"
  precedence   = 50
}

resource "aws_cognito_user_group" "campaign_managers" {
  name         = "campaign_managers"
  user_pool_id = aws_cognito_user_pool.care2give.id
  description  = "Campaign Managers"
  precedence   = 49
}

resource "aws_cognito_user_group" "normal_users" {
  name         = "normal_users"
  user_pool_id = aws_cognito_user_pool.care2give.id
  description  = "Normal Users"
  precedence   = 1
}
