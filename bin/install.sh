#!/bin/bash
Red='\033[0;31m'
Green='\033[0;32m'
Color_Off='\033[0m'

POSTGRES_PORT=5432

check_dependencies () {
  DEPENDENCIES=(
    docker
    docker-compose
    psql
    nc
  )

  not_installed_count=0;
  echo 'Testing if all dependencies are installed...'
  echo

  for program in "${DEPENDENCIES[@]}"; do
    if hash "$program" &>/dev/null; then
      echo -e "${Green}$program${Color_Off} found"
    else
      echo -e "${Red}$program${Color_Off} is not installed";
      ((not_installed_count++))
    fi
  done

  if [[ $not_installed_count -gt 0 ]]; then
    echo -e "${Red}install needed dependencies first, then run this command again.${Color_Off}"
    exit 1
  else
    echo -e "${Green}Awesome! All dependencies are installed${Color_Off}"
    echo
  fi
}

initiate_env_file () {
  echo "We will now config some secret environment variables."

  echo "Please, provide AWS ACCESS KEY ID:"
  read AWS_CREDENTIALS_ACCESS_KEY_ID

  echo "Now, provide AWS SECRET ACCESS KEY:"
  read AWS_CREDENTIALS_SECRET_ACCESS_KEY

  echo "What's the Auth0 Client Id:"
  read AUTHZ_CLIENT_ID

  echo "And the Auth0 Client Secret:"
  read AUTHZ_CLIENT_SECRET

  echo "Last one, our Sentry DSN url:"
  read SENTRY_DSN

  echo "Copying .env.example to .env"
  cp .env.example .env

  echo "
  # Added by install.sh
    AWS_CREDENTIALS_ACCESS_KEY_ID=$AWS_CREDENTIALS_ACCESS_KEY_ID
    AWS_CREDENTIALS_SECRET_ACCESS_KEY=$AWS_CREDENTIALS_SECRET_ACCESS_KEY
    AUTHZ_CLIENT_ID=$AUTHZ_CLIENT_ID
    AUTHZ_CLIENT_SECRET=$AUTHZ_CLIENT_SECRET
    SENTRY_DSN=$SENTRY_DSN
  " >> .env

  echo -e "${Green}Awesome! .env is now configured.${Color_Off}"
}

check_env_file () {
  echo "Checking .env file"
  if [ ! -f ".env" ]; then
    initiate_env_file
  else
    echo ".env file exists, skipping"
  fi
  echo

  cat ./conf/$1 | while read line; do
    $line
  done
}

run_docker_compose () {
  echo "Stopping and reinstanciating docker-compose containers"

  docker-compose stop
  docker-compose rm -f
  docker-compose up -d

  echo
  echo -e "${Green}Awesome! Docker-compose containers are now accessible.${Color_Off}"
  echo
}

run_first_database_import () {
  echo "sleeping until postgres is up"
  sleep 10
  echo "postgres is now up"

  ./bin/import-database-dump

  echo -e "${Green}Awesome! First dump of the database imported.${Color_Off}"

  echo
}

run_migrations () {
  echo "running migrations"
  npm run migration:run

  echo -e "${Green}Awesome! Migrations executed.${Color_Off}"
  echo
}

run() {
  check_dependencies
  check_env_file
  run_docker_compose
  run_first_database_import
  run_migrations

  echo -e "${Green}Awesome! everything is now configured and dependencies are running, just start the application. with 'npm run start:dev'${Color_Off}"
  echo 
}

run