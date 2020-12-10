project = "business"

app "app" {
  build {
    use "pack" {}
    registry {
      use "aws-ecr" {
        region = "sa-east-1"
        repository = "business"
        tag = gitrefpretty()
      }
    }
  }

  deploy{
    use "exec" {
      command = ["./.gitops/deploy.sh -e develop -t ${gitrefpretty()}"]
    }
  }
}
