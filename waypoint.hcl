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
      command = [
        "bash",
        "-c",
        #"bash <(curl -s https://raw.githubusercontent.com/budproj/gist/main/gitops/deploy.sh) -t ${gitrefpretty()}",
        "bash ../../delucca/gist/gitops/deploy.sh -t ${gitrefpretty()}",
      ]
    }
  }
}
