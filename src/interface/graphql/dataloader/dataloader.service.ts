import { Injectable } from '@nestjs/common'
import * as DataLoader from 'dataloader'
import { In } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

export interface IDataloaders {
  team: DataLoader<string, Team>
  user: DataLoader<string, User>
  cycle: DataLoader<string, Cycle>
  objective: DataLoader<string, Objective>
  keyResult: DataLoader<string, KeyResult>
  keyResultCheckIn: DataLoader<string, KeyResultCheckIn>
  keyResultCheckMark: DataLoader<string, KeyResultCheckMark>
  keyResultComment: DataLoader<string, KeyResultComment>
  keyResultUpdate: DataLoader<string, KeyResultUpdate>
}

@Injectable()
export class DataloaderService {
  constructor(private readonly core: CoreProvider) {}

  getLoaders(): IDataloaders {
    return {
      team: this.dataloaderById(this.core.team),
      user: this.dataloaderById(this.core.user),
      cycle: this.dataloaderById(this.core.cycle),
      objective: this.dataloaderById(this.core.objective),
      keyResult: this.dataloaderById(this.core.keyResult),
      keyResultCheckIn: this.dataloaderById(this.core.keyResult.keyResultCheckInProvider),
      keyResultCheckMark: this.dataloaderById(this.core.keyResult.keyResultCheckMarkProvider),
      keyResultComment: this.dataloaderById(this.core.keyResult.keyResultCommentProvider),
      keyResultUpdate: this.dataloaderById(this.core.keyResult.keyResultUpdateProvider),
    }
  }

  private dataloaderById<E extends CoreEntity>(provider: CoreEntityProvider<E, any>) {
    return new DataLoader<string, E>(async (ids: Array<E['id']>) =>
      // @ts-expect-error
      provider.getMany({ id: In(ids) }),
    )
  }
}
