import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultCheckInInterface } from './check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultFormat } from './enums/key-result-format.enum'
import { KeyResultInterface } from './interfaces/key-result.interface'

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

  @Column({ type: 'simple-enum', enum: KeyResultType, default: KeyResultType.ASCENDING })
  public type: KeyResultType

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.owner)
  public ownerId: UserInterface['id']

  @ManyToOne('User', 'keyResults')
  public owner: UserInterface

  @ManyToMany('User')
  @JoinTable()
  public supportTeamMembers: UserInterface[]

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.objective)
  public objectiveId: ObjectiveInterface['id']

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveInterface

  @Column({ nullable: true })
  @RelationId((keyResult: KeyResult) => keyResult.team)
  public teamId?: TeamInterface['id']

  @ManyToOne('Team', 'keyResults', { nullable: true })
  public team?: TeamInterface

  @Column({ type: 'text', nullable: true })
  public description?: string

  @OneToMany('KeyResultComment', 'keyResult', { nullable: true })
  public comments?: KeyResultCommentInterface[]

  @OneToMany('KeyResultCheckIn', 'keyResult', { nullable: true })
  public checkIns?: KeyResultCheckInInterface[]
}
