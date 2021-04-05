import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeORMSeed } from 'lib/jest/typeorm'
import databaseConfig from 'src/config/database/config'
import DomainCycleRepository from 'src/domain/cycle/repository'
import DomainTeamModule from 'src/domain/team'
import { User } from 'src/domain/user/entities'
import userSeed from 'src/domain/user/seed'

import DomainCycleService from './service'

const buildTestModule = () =>
  Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(databaseConfig),
      TypeOrmModule.forFeature([DomainCycleRepository]),
      DomainTeamModule,
    ],
    providers: [DomainCycleService],
  })

describe('DomainCycleService', () => {
  let module: TestingModule
  let domainCycleService: DomainCycleService
  let user: TypeORMSeed<User>

  beforeAll(async () => {
    module = await buildTestModule().compile()
    domainCycleService = module.get<DomainCycleService>(DomainCycleService)

    user = new TypeORMSeed(User, userSeed)
  })

  afterAll(async () => {
    await module.close()
  })

  describe('get a single cycle', () => {
    it('can get a single company cycle, constrained to company', async () => {
      const fakeUsers = await user.create()

      console.log(fakeUsers)

      expect(true).toEqual(false)
    })
  })
})
