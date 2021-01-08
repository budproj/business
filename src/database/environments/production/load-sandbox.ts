// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { createConnection } from 'typeorm'

import config from 'config/database/config'
import { runQueriesFromFile } from 'database/actions'

const loadSandbox = async () => {
  const sqlPaths = [
    join(__dirname, './sandbox-account/users.sql'),
    join(__dirname, './sandbox-account/teams.sql'),
    join(__dirname, './sandbox-account/teams_users_user.sql'),
    join(__dirname, './sandbox-account/cycles.sql'),
    join(__dirname, './sandbox-account/objectives.sql'),
    join(__dirname, './sandbox-account/key-results.sql'),
  ]

  const { manager } = await createConnection(config)

  await sqlPaths.reduce(async (previousPromise, nextPath) => {
    await previousPromise
    return runQueriesFromFile(nextPath, manager)
  }, Promise.resolve())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
loadSandbox()
