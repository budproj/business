import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KEY_RESULT_FORMAT } from './constants'
import { KeyResultDTO } from './dto'

@Entity()
export class KeyResult implements KeyResultDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public title: string

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column('numeric')
  public initialValue: number

  @Column('numeric')
  public goal: number

  @Column({ type: 'enum', enum: KEY_RESULT_FORMAT, default: KEY_RESULT_FORMAT.NUMBER })
  public format: KEY_RESULT_FORMAT

  @CreateDateColumn()
  public createdAt: Date

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
}
