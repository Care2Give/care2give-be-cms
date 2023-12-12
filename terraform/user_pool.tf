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
    required                 = true
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

# resource "aws_cognito_identity_provider" "google" {
#   user_pool_id  = aws_cognito_user_pool.care2give.id
#   provider_name = "Google"
#   provider_type = "Google"
#
#   provider_details = {
#     authorize_scopes = "email"
#     client_id        = var.google_client_id
#     client_secret    = var.google_client_secret
#   }
#
#   attribute_mapping = {
#     email    = "email"
#     username = "email"
#   }
# }

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
