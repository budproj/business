import { SqlReader } from 'node-sql-reader'
import { createConnection } from 'typeorm'

import config from 'config/database/config'

const runQueryFromFile = async (sqlPath: string) => {
  const { manager } = await createConnection(config)

  const queries = SqlReader.readSqlFile(sqlPath)
  const queryPromises = queries.map(async (query) => manager.query(query))

  await Promise.all(queryPromises)
}

export default runQueryFromFile
