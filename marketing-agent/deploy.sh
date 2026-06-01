#!/usr/bin/env bash
# Build, push Docker image to ECR, and confirm next scheduled run.
# Run this from the marketing-agent/ directory after terraform apply.

set -euo pipefail

AWS_REGION=${AWS_REGION:-ap-south-1}
ECR_URL=$(cd infra && terraform output -raw ecr_repository_url)

echo "==> Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_URL"

echo "==> Building image..."
docker build -t keptlocal-marketing-agent .

echo "==> Pushing to ECR..."
docker tag keptlocal-marketing-agent:latest "$ECR_URL:latest"
docker push "$ECR_URL:latest"

echo "==> Done. Image live at $ECR_URL:latest"
echo "    Next scheduled run: tomorrow 08:30 IST (03:00 UTC)"
