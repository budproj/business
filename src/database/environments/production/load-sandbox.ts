// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { runQueryFromFile } from 'database/actions'

const sqlPaths = [
  join(__dirname, './sandbox-account/users.sql'),
  join(__dirname, './sandbox-account/teams.sql'),
]
const queryPromises = sqlPaths.map(runQueryFromFile)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
queryPromises.reduce(async (previousPromise, nextQuery) => {
  await previousPromise
  return nextQuery
}, Promise.resolve())
