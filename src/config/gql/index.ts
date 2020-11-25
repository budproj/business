import config, { GqlConfigOptions } from './config'

export * from './config'

const gql = (): GqlConfigOptions => config

export default gql
