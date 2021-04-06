import { typeormConfig } from './typeorm.config'
import { TypeORMConfigInterface } from './typeorm.interface'

export function createTypeORMConfig(): TypeORMConfigInterface {
  return typeormConfig
}
