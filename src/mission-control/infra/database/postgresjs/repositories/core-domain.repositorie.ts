import { Injectable } from '@nestjs/common'

import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'

import { PostgresJsService } from '../postgresjs.service'

interface User {
  first_name: string
}

@Injectable()
export class PostgresJsCoreDomainRepository implements CoreDomainRepository {
  constructor(private readonly postgres: PostgresJsService) {}

  // { returned: Result(1) [ { first_name: 'Evil' } ] }

  async findUserById(userId: string): Promise<string> {
    return this.postgres.getSqlInstance()<User[]>`
      SELECT 
        "first_name"
      FROM "user"
      WHERE id = ${userId}
    `.then((result) => result[0].first_name)
  }
}
