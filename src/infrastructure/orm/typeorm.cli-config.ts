import { typeormConfig } from '@config/typeorm/typeorm.config'

import { TypeORMFactory } from './typeorm.factory'

export = TypeORMFactory.buildTypeORMConnectionConfig(typeormConfig)
