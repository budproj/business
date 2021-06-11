import { DeleteResult } from 'typeorm'

import { Command } from './base.command'

export class DeleteObjectiveCommand extends Command<DeleteResult> {
  public async execute(objectiveID: string): Promise<DeleteResult> {
    const keyResults = await this.core.keyResult.deleteFromObjectiveID(objectiveID)
    const objective = await this.core.objective.delete({
      id: objectiveID,
    })

    return {
      raw: [...keyResults.raw, ...objective.raw],
      affected: keyResults.affected + objective.affected,
    }
  }
}
