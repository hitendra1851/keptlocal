terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── ECR ──────────────────────────────────────────────────────────────────────

resource "aws_ecr_repository" "agent" {
  name                 = "keptlocal-marketing-agent"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "agent" {
  repository = aws_ecr_repository.agent.name
  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 3 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 3
      }
      action = { type = "expire" }
    }]
  })
}

# ── Secrets Manager ───────────────────────────────────────────────────────────

resource "aws_secretsmanager_secret" "github_token" {
  name                    = "keptlocal/marketing-agent/github-token"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret" "gmail_app_password" {
  name                    = "keptlocal/marketing-agent/gmail-app-password"
  recovery_window_in_days = 0
}

# ── IAM ──────────────────────────────────────────────────────────────────────

resource "aws_iam_role" "execution" {
  name = "keptlocal-marketing-agent-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "execution_managed" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "execution_secrets" {
  name = "read-secrets"
  role = aws_iam_role.execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["secretsmanager:GetSecretValue"]
      Resource = [
        aws_secretsmanager_secret.github_token.arn,
        aws_secretsmanager_secret.gmail_app_password.arn,
      ]
    }]
  })
}

resource "aws_iam_role" "task" {
  name = "keptlocal-marketing-agent-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role" "scheduler" {
  name = "keptlocal-marketing-agent-scheduler"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "scheduler.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "scheduler" {
  name = "run-ecs-task"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["ecs:RunTask"]
        Resource = [aws_ecs_task_definition.agent.arn]
      },
      {
        Effect   = "Allow"
        Action   = ["iam:PassRole"]
        Resource = [aws_iam_role.execution.arn, aws_iam_role.task.arn]
      }
    ]
  })
}

# ── ECS ──────────────────────────────────────────────────────────────────────

resource "aws_ecs_cluster" "main" {
  name = "keptlocal-marketing"
}

resource "aws_cloudwatch_log_group" "agent" {
  name              = "/ecs/keptlocal-marketing-agent"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "agent" {
  family                   = "keptlocal-marketing-agent"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512   # 0.5 vCPU
  memory                   = 1024  # 1 GB — enough for headless Chromium
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  container_definitions = jsonencode([{
    name  = "agent"
    image = "${aws_ecr_repository.agent.repository_url}:latest"

    environment = [
      { name = "GITHUB_REPO",       value = var.github_repo },
      { name = "RECIPIENT_EMAIL",   value = var.recipient_email },
    ]

    secrets = [
      { name = "GITHUB_TOKEN",       valueFrom = aws_secretsmanager_secret.github_token.arn },
      { name = "GMAIL_APP_PASSWORD", valueFrom = aws_secretsmanager_secret.gmail_app_password.arn },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.agent.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

# ── Networking (default VPC) ──────────────────────────────────────────────────

data "aws_vpc" "default" { default = true }

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "agent" {
  name        = "keptlocal-marketing-agent"
  description = "Outbound HTTPS only for marketing agent"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ── EventBridge Scheduler — daily 8:30am IST (3:00 UTC) ─────────────────────

resource "aws_scheduler_schedule" "daily" {
  name       = "keptlocal-daily-marketing"
  group_name = "default"

  flexible_time_window { mode = "OFF" }

  schedule_expression          = "cron(0 3 * * ? *)"
  schedule_expression_timezone = "UTC"

  target {
    arn      = aws_ecs_cluster.main.arn
    role_arn = aws_iam_role.scheduler.arn

    ecs_parameters {
      task_definition_arn = aws_ecs_task_definition.agent.arn
      launch_type         = "FARGATE"

      network_configuration {
        assign_public_ip = true
        subnets          = data.aws_subnets.default.ids
        security_groups  = [aws_security_group.agent.id]
      }
    }
  }
}
