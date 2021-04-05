import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import config from './config'

const database = (): TypeOrmModuleOptions => config

export default database
