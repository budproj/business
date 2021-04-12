import { Column, Entity, ManyToOne, OneToMany, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { ObjectiveInterface } from './interfaces/objective.interface'

@Entity()
export class Objective extends CoreEntity implements ObjectiveInterface {
  @Column()
  public title: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((objective: Objective) => objective.cycle)
  public cycleId: CycleInterface['id']

  @ManyToOne('Cycle', 'objectives')
  public cycle: CycleInterface

  @Column()
  @RelationId((objective: Objective) => objective.owner)
  public ownerId: UserInterface['id']

  @ManyToOne('User', 'objectives')
  public owner: UserInterface

  @OneToMany('KeyResult', 'objective', { nullable: true })
  public keyResults?: KeyResultInterface[]
}
