// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { createConnection } from 'typeorm'

import config from 'src/config/database/config'
import { runQueriesFromFile } from 'src/database/actions'

const loadDump = async () => {
  const client = process.argv[2]
  if (!client) throw new Error('You must declare a client')

  const sqlPaths = [
    join(__dirname, `./clients/${client}/teams.sql`),
    join(__dirname, `./clients/${client}/teams_users_user.sql`),
    join(__dirname, `./clients/${client}/cycles.sql`),
    join(__dirname, `./clients/${client}/objectives.sql`),
    join(__dirname, `./clients/${client}/key-results.sql`),
  ]

  const { manager } = await createConnection(config)

  await sqlPaths.reduce(async (previousPromise, nextPath) => {
    await previousPromise
    return runQueriesFromFile(nextPath, manager)
  }, Promise.resolve())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
loadDump()
