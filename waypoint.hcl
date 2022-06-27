project = "business"

variable "GITHUB_TOKEN" {
  type = string
  default = ""
}

app "app" {
  build {
    use "docker" {
      build_args = {
        "GITHUB_TOKEN" = var.GITHUB_TOKEN
      }
    }

    registry {
      use "aws-ecr" {
        region = "sa-east-1"
        repository = "business"
        tag = gitrefhash()
      }
    }
  }

  deploy{
    use "exec" {
      command = [
        "bash",
        "-c",
        "bash <(curl -s https://raw.githubusercontent.com/budproj/gist/main/gitops/deploy.sh) -t ${gitrefhash()} -s ${gitreftag()}",
      ]
    }
  }
}
