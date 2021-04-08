import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.entity'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultFormat } from './enums/key-result-format.enum'
import { KeyResultInterface } from './key-result.interface'

@Entity()
export class KeyResult extends CoreEntity implements KeyResultInterface {
  @Column()
  public title: string

  @Column('numeric')
  public initialValue: number

  @Column('numeric')
  public goal: number

  @Column({ type: 'simple-enum', enum: KeyResultFormat, default: KeyResultFormat.NUMBER })
  public format: KeyResultFormat

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResults')
  public owner: UserInterface

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.owner)
  public ownerId: UserInterface['id']

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveInterface

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.objective)
  public objectiveId: ObjectiveInterface['id']

  @ManyToOne('Team', 'keyResults')
  public team: TeamInterface

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.team)
  public teamId: TeamInterface['id']

  @Column({ type: 'text', nullable: true })
  public description?: string
}
