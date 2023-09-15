/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable } from '@nestjs/common'

import { buildWeekId } from '../../../helpers/build-week-id'
import { TaskCreationProducer } from '../messaging/task-queue.js'
import { CoreDomainRepository } from '../repositories/core-domain-repository'

@Injectable()
export class TaskPlannerService {
  constructor(
    private readonly producer: TaskCreationProducer,
    private readonly coreDomainRepository: CoreDomainRepository,
  ) {}

  // Fluxo "pesado" -> não pode estar associado a nenhuma chamada de API síncrona
  async execute() {
    const weekId = buildWeekId()

    // Query otimizada -> já traz a lista de teamIds para cada usuário (evitar N+1 queries)
    // Preferencialmente, sem fazer nenhuma chamada para a API do business (Repository próprio que consome as mesmas tabelas)
    const users = await this.coreDomainRepository.findAllUsersAndTeams()

    let count = 0

    // Fluxo 2.1. Agendamento da designação de tarefas
    for (const user of users) {
      for (const teamId of user.teamIds) {
        // Sequencial, pois os INSERTs estão intermediados por uma fila distribuída (ex: sqs.sendMessage())
        this.producer.produce({
          userId: user.userId,
          teamId,
          weekId,
        })

        count++
      }
    }

    return count
  }
}
