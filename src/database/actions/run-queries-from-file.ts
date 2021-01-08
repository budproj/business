import { SqlReader } from 'node-sql-reader'
import { createConnection, EntityManager } from 'typeorm'

import config from 'config/database/config'

const runQueriesFromFile = async (sqlPath: string, manager?: EntityManager) => {
  if (!manager) manager = (await createConnection(config)).manager

  const queries = SqlReader.readSqlFile(sqlPath)

  await queries.reduce(async (previousPromise, nextQuery) => {
    await previousPromise
    return manager.query(nextQuery)
  }, Promise.resolve())
}

export default runQueriesFromFile
