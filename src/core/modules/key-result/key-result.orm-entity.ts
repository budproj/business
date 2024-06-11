import {
  Column,
  Entity,
  Index,
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
import { KeyResultCheckMark } from './check-mark/key-result-check-mark.orm-entity'
import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultFormat } from './enums/key-result-format.enum'
import { KeyResultMode } from './enums/key-result-mode.enum'
import { Author } from './interfaces/key-result-author.interface'
import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResultUpdateInterface } from './update/key-result-update.interface'

@Entity()
@Index(['mode', 'teamId', 'updatedAt'])
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

  @Column({ type: 'simple-enum', enum: KeyResultMode, default: KeyResultMode.PUBLISHED })
  public mode: KeyResultMode

  @Column({ type: 'jsonb', nullable: true })
  public lastUpdatedBy?: Author

  @OneToMany('KeyResultComment', 'keyResult', { nullable: true })
  public comments?: KeyResultCommentInterface[]

  @OneToMany('KeyResultCheckIn', 'keyResult', { nullable: true })
  public checkIns?: KeyResultCheckInInterface[]

  @OneToMany('KeyResultUpdate', 'keyResult', { nullable: true })
  public updates?: KeyResultUpdateInterface[]

  @Column({ type: 'json', nullable: true })
  public commentCount?: JSON

  checkMarks?: KeyResultCheckMark[]
}
