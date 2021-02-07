import { Column, Entity, ManyToOne, OneToMany, RelationId, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KEY_RESULT_FORMAT } from './constants'
import { KeyResultDTO } from './dto'

@Entity()
export class KeyResult extends DomainEntity implements KeyResultDTO {
  @Column()
  public title: string

  @Column('numeric')
  public initialValue: number

  @Column('numeric')
  public goal: number

  @Column({ type: 'simple-enum', enum: KEY_RESULT_FORMAT, default: KEY_RESULT_FORMAT.NUMBER })
  public format: KEY_RESULT_FORMAT

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResults')
  public owner: UserDTO

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.owner)
  public ownerId: UserDTO['id']

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveDTO

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.objective)
  public objectiveId: ObjectiveDTO['id']

  @ManyToOne('Team', 'keyResults')
  public team: TeamDTO

  @Column()
  @RelationId((keyResult: KeyResult) => keyResult.team)
  public teamId: TeamDTO['id']

  @OneToMany('KeyResultCheckIn', 'keyResult', { nullable: true })
  public checkIns?: KeyResultCheckInDTO

  @Column({ type: 'text', nullable: true })
  public description?: string
}
