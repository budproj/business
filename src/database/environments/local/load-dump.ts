// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { runQueriesFromFile } from 'database/actions'

const sqlPath = join(__dirname, './dump.sql')
runQueriesFromFile(sqlPath) // eslint-disable-line @typescript-eslint/no-floating-promises
