import path from 'path'

import { runQueryFromFile } from 'database/actions'

const sqlPath = path.join(__dirname, './dump.sql')
runQueryFromFile(sqlPath) // eslint-disable-line @typescript-eslint/no-floating-promises
