import { SqlReader } from 'node-sql-reader'
import { createConnection } from 'typeorm'

import config from 'config/database/config'

const runQueryFromFile = async (sqlPath: string) => {
  const { manager } = await createConnection(config)

  const queries = SqlReader.readSqlFile(sqlPath)

  await queries.reduce(async (previousPromise, nextQuery) => {
    await previousPromise
    return manager.query(nextQuery)
  }, Promise.resolve())
}

export default runQueryFromFile
