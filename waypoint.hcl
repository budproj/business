project = "business"

app "app" {
  build {
    use "docker" {}

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
      command = ["bash", "./.gitops/deploy.sh", "-s", "develop", "-t", gitrefpretty()]
    }
  }
}
