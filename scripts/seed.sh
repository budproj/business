#!/usr/bin/env bash

# WHAT DOES THIS SCRIPT DO
# -------------------------------------------------------------------------------------------------
#
# It seeds develop data to our database. It uses the current dump to do so. In a nutshell, it
# executes the following steps:
# - Remove the previous database
# - Creates a new database
# - Load the current dump data
#
# REQUIRED DEPENDENCIES
# -------------------------------------------------------------------------------------------------
#
# To run this script, you must have the following tools installed:
# - bash 4
# - psql 12

# Global variables
# -------------------------------------------------------------------------------------------------

DB_NAME='business_local'
ROOT_DIR=$(git rev-parse --show-toplevel)


# Entrypoint
# -------------------------------------------------------------------------------------------------

function main {
  validate_requirements
  clear_database
  create_database
  load_updated_data

  echo
}

# Validate requirements
# -------------------------------------------------------------------------------------------------

function validate_requirements {
  validate_bash_dependency
  validate_psql_dependency
}

function validate_bash_dependency {
  major_version="$(bash --version | head -1 | cut -d ' ' -f 4 | cut -d '.' -f 1)"
  min_major_version="4"

  if [ "${major_version}" -lt "${min_major_version}" ]; then
    throw_error "Your bash major version must be ${min_major_version} or greater"
  fi
}

function validate_psql_dependency {
  major_version="$(psql --version | head -1 | cut -d ' ' -f 3 | cut -d '.' -f 1)"
  min_major_version="12"

  if [ "${major_version}" -lt "${min_major_version}" ]; then
    throw_error "Your psql major version must be ${min_major_version} or greater"
  fi
}

# Clear database
# -------------------------------------------------------------------------------------------------

function clear_database {
  psql postgres -c "DROP DATABASE ${DB_NAME}" &> /dev/null &
  pid=$!

  wait_with_spinner "${pid}" "Clearing" "Clear database"
}

# Create database
# -------------------------------------------------------------------------------------------------

function create_database {
  psql postgres -c "CREATE DATABASE ${DB_NAME}" &> /dev/null &
  pid=$!

  wait_with_spinner "${pid}" "Creating" "Create database"
}

# Load updated data
# -------------------------------------------------------------------------------------------------

function load_updated_data {
  psql $DB_NAME < $ROOT_DIR/src/database/environments/develop/dump.sql &> /dev/null &
  pid=$!

  wait_with_spinner "${pid}" "Loading" "Load updated data"
}

# Helpers
# -------------------------------------------------------------------------------------------------

function wait_with_spinner {
  pid=$1
  message=$2
  category=${3:-Waiting}
  spin='⣾⣽⣻⢿⡿⣟⣯⣷'

  echo

  id=0
  while kill -0 $pid 2>/dev/null; do
    i=$(( (i+1) %8 ))
    printf "\x1B[36m\r${spin:$i:1}\e[1m ${category}:\x1B[0m ${message}"
    sleep .1
  done
}

function throw_error {
  message=$1

  bold=$(tput bold)
  reset=$(tput sgr0)
  red=$(tput setaf 1)

  echo "${bold}${red}Error:${reset}"
  echo "${red}  ${message}${reset}"
  exit 1
}

# Execute
# -------------------------------------------------------------------------------------------------

main