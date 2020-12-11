#!/bin/bash

set -o errexit
set -o errtrace
set -o pipefail
trap 'echo "Aborting due to errexit on line $LINENO. Exit code: $?" >&2' ERR

# Environment
# -------------------------------------------------------------------------------------------------
_ME="$(basename "${0}")"
_TMP_DIR=$(mktemp -u)
_GIT_REPO="git@github.com:budproj/k8s-manifests.git"
_TAG="latest"
_STAGE="develop"
_GITOPS_DIR=$(cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)
_APP_DIR=$(git rev-parse --show-toplevel)
_APP_NAME=$(basename $_APP_DIR)

# Helpers
# -------------------------------------------------------------------------------------------------
usage() {
  echo -e "$(cat <<EOM
         _ _
    __ _(_) |_ ___  _ __  ___
   / _  | | __/ _ \| '_ \/ __|
  | (_| | | || (_) | |_) \__ \
   \__, |_|\__\___/| .__/|___/
   |___/           |_|

Deploys this application using our Gitops structure.

Usage:
  ${_ME} [<arguments>]
  ${_ME} -t | --tag
  ${_ME} -s | --stage
  ${_ME} -h | --help
Options:
  -t --tag     Tag for your image for this deployment (default: latest)
  -s --stage   The stage you are deploying. It must be \x1B[36mdevelop\x1B[0m or \x1B[36mproduction\x1B[0m (default: develop)
  -h --help    Show this screen.
EOM
)"
}

parse_options() {
  if [ $# -eq 0 ]; then
    return
  fi

  optstring=h
  unset options

  while (($#)); do
    case $1 in
      -[!-]?*)
        for ((i=1; i<${#1}; i++)); do
          c=${1:i:1}

          options+=("-$c")

          if [[ $optstring = *"$c:"* && ${1:i+1} ]]; then
            options+=("${1:i+1}")
            break
          fi
        done
        ;;
      --?*=*) options+=("${1%%=*}" "${1#*=}");;
      --)
        options+=(--endopts)
        shift
        options+=("$@")
        break
        ;;
      *) options+=("$1");;
    esac

    shift
  done

  set -- "${options[@]}"
  unset options

  while [[ $1 = -?* ]]; do
    case $1 in
      -h|--help) usage >&2; exit 0;;
      -t|--tag) add_tag $2; shift;;
      -s|--stage) add_stage $2; shift;;
      --endopts) shift; break;;
      *) die "invalid option: $1";;
    esac

    shift
  done
}

wait_with_spinner() {
  pid=$1
  message=$2
  spin='⣾⣽⣻⢿⡿⣟⣯⣷'
  echo

  i=0
  while kill -0 $pid 2>/dev/null
  do
    i=$(( (i+1) %8 ))
    printf "\x1B[36m\r${spin:$i:1}\x1B[0m $message"
    sleep .1
  done
}

# Option parsers
# -------------------------------------------------------------------------------------------------
add_tag() {
  _TAG=$1
}

add_stage() {
  allowed_environments='develop production'

  if [[ $allowed_environments == *"$1"* ]]; then
    _STAGE=$1
  fi
}

# Script functions
# -------------------------------------------------------------------------------------------------
deploy() {
  clone_required_manifests
  ensure_environment
  update_manifest
  commit_updates
  remove_tmp_dir
}

clone_required_manifests() {
  git clone --quiet $_GIT_REPO $_TMP_DIR &
  pid=$!

  wait_with_spinner "${pid}" "Clonning manifests repository"
}

ensure_environment() {
  mkdir -p $_TMP_DIR/manifests/applications/$_APP_NAME
  mkdir -p $_TMP_DIR/manifests/applications/$_APP_NAME/$_STAGE
}

update_manifest() {
  export ECR_TAG=$_TAG
  files=$(find "${_GITOPS_DIR}/${_STAGE}" -regex '.*\.ya*ml')

  for file in $files; do
    filename=$(basename $file)
    envsubst < $file > $_TMP_DIR/manifests/applications/$_APP_NAME/$_STAGE/$filename
  done
}

commit_updates() {
  message="(automatic) deploys \"${_APP_NAME}\" application in ${_STAGE} environment"

  pushd $_TMP_DIR "$@">/dev/null

  git add -A

  git commit --quiet -m "$message" &
  pid=$!
  wait_with_spinner "${pid}" "Commiting new manifests"

  git push --quiet

  popd "$@">/dev/null
}

remove_tmp_dir() {
  rm -rf $_TMP_DIR
}

# Main function
# -------------------------------------------------------------------------------------------------
_main() {
  parse_options "$@"
  deploy
}

_main "$@"
