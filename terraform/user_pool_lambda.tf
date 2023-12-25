data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_policy" "policy" {
  name = "presignup_hook_policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : "logs:CreateLogGroup",
        "Resource" : "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : [
          "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/presignup_hook:*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminLinkProviderForUser",
          "cognito-idp:AdminGetUser"
        ],
        "Resource" : "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/${aws_cognito_user_pool.care2give.id}"
      }
    ]
  })
}

resource "aws_iam_role" "presignup_hook_role" {
  name               = "presignup_hook_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "attach_permissions" {
  role       = aws_iam_role.presignup_hook_role.name
  policy_arn = aws_iam_policy.policy.arn
}

data "archive_file" "lambda_file" {
  type        = "zip"
  source_file = "./lambda/PreSignUpMergeExternalAccountWithNativeAccount.py"
  output_path = "presignup_hook.zip"
}

resource "aws_lambda_function" "presignup_hook" {
  filename         = "presignup_hook.zip"
  function_name    = "presignup_hook"
  handler          = "PreSignUpMergeExternalAccountWithNativeAccount.lambda_handler"
  source_code_hash = data.archive_file.lambda_file.output_base64sha256

  role    = aws_iam_role.presignup_hook_role.arn
  runtime = "python3.10"
}

resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.presignup_hook.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.care2give.arn
}
