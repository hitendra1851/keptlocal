output "ecr_repository_url" {
  description = "Push your Docker image here: docker push <url>:latest"
  value       = aws_ecr_repository.agent.repository_url
}

output "github_token_secret_arn" {
  description = "Set value: aws secretsmanager put-secret-value --secret-id <arn> --secret-string <token>"
  value       = aws_secretsmanager_secret.github_token.arn
}

output "resend_api_key_secret_arn" {
  value = aws_secretsmanager_secret.resend_api_key.arn
}
