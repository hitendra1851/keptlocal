output "ecr_repository_url" {
  description = "Push your Docker image here: docker push <url>:latest"
  value       = aws_ecr_repository.agent.repository_url
}

output "github_token_secret_arn" {
  description = "Set value: aws secretsmanager put-secret-value --secret-id <arn> --secret-string <token>"
  value       = aws_secretsmanager_secret.github_token.arn
}

output "gmail_app_password_secret_arn" {
  description = "Set value: aws secretsmanager put-secret-value --region ap-south-1 --secret-id <arn> --secret-string <password>"
  value       = aws_secretsmanager_secret.gmail_app_password.arn
}
