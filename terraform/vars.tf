variable "aws_region" {
  type        = string
  description = "The region in which the resources will be created"
  default     = "ap-southeast-1"
}

variable "aws_access_key" {
  type        = string
  sensitive   = true
  description = "The aws development account access key"
}

variable "aws_secret_key" {
  type        = string
  sensitive   = true
  description = "The aws development account secret key"
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# variable "google_client_id" {
#   type        = string
#   sensitive   = true
#   description = "Google Client ID"
# }
#
# variable "google_client_secret" {
#   type        = string
#   sensitive   = true
#   description = "Google Client Secret"
# }
