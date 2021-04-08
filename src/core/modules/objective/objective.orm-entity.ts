import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.entity'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { ObjectiveInterface } from './objective.interface'

@Entity()
export class Objective extends CoreEntity implements ObjectiveInterface {
  @Column()
  public title: string

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Cycle', 'objectives')
  public cycle: CycleInterface

  @Column()
  @RelationId((objective: Objective) => objective.cycle)
  public cycleId: CycleInterface['id']

  @ManyToOne('User', 'objectives')
  public owner: UserInterface

  @Column()
  @RelationId((objective: Objective) => objective.owner)
  public ownerId: UserInterface['id']
}
