variable "aws_region" {
  description = "AWS region — ap-south-1 (Mumbai) is closest to Ahmedabad"
  type        = string
  default     = "ap-south-1"
}

variable "github_repo" {
  type    = string
  default = "hitendra1851/keptlocal"
}

variable "recipient_email" {
  type    = string
  default = "hitendra.patel2986@gmail.com"
}
