import {
  ConnectionOptions,
  createConnection,
  EntityTarget,
  getConnection,
  getCustomRepository,
  getRepository,
  ObjectType,
} from 'typeorm'

// Using a sqlite database for testing, so take care with advanced sql features
const connectionOptions = (entities: any[]): ConnectionOptions => ({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities,
  synchronize: true,
  logging: false,
})

export const startInMemoryDatabase = async (entities: any[]) =>
  createConnection(connectionOptions(entities))
export const closeConnection = async () => getConnection().close()
export const repository = <T>(entity: EntityTarget<T>) => getRepository(entity)

type Constructable<T> = new (...arguments_: any) => T

export const testProvider = <R, P>(Repository: ObjectType<R>, Provider: Constructable<P>): P => {
  const providerRepository = getCustomRepository(Repository)
  return new Provider(providerRepository)
}
