import config from './config'
import { GqlConfigOptions } from './types'

export * from './config'

const gql = (): GqlConfigOptions => config

export default gql
