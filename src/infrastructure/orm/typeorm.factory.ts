import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory } from '@nestjs/typeorm'

import { TypeORMConfigProvider } from '@config/typeorm/typeorm.provider'

@Injectable()
export class TypeORMFactory implements TypeOrmOptionsFactory {
  constructor(private readonly config: TypeORMConfigProvider) {}

  public createTypeOrmOptions() {
    return {
      type: this.config.type as any,
      host: this.config.endpoint.host,
      port: this.config.endpoint.port,
      database: this.config.endpoint.database,
      username: this.config.authentication.user,
      password: this.config.authentication.password,
      namingStrategy: this.config.conventions.naming,
      logging: this.config.logging.enabled,
      entities: this.config.pattern.file.entities,
      migrations: this.config.pattern.file.migrations,
      cli: {
        migrationsDir: this.config.pattern.directory.migrations,
      },
    }
  }
}