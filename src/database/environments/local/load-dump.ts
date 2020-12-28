// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { runQueryFromFile } from 'database/actions'

const sqlPath = join(__dirname, './dump.sql')
runQueryFromFile(sqlPath) // eslint-disable-line @typescript-eslint/no-floating-promises
