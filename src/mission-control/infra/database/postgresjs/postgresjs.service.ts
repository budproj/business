import { Injectable, OnModuleInit } from '@nestjs/common'
import * as postgres from 'postgres'

@Injectable()
export class PostgresJsService implements OnModuleInit {
  private sql: postgres.Sql

  async onModuleInit() {
    this.sql = postgres({
      host: process.env.TYPEORM_HOST,
      port: Number.parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
    })
  }

  getSqlInstance() {
    return this.sql
  }
}
