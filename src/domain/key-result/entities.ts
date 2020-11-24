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

import { KeyResultDTO } from './dto'

@Entity()
export class KeyResult implements KeyResultDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column('numeric')
  public initialValue: number

  @Column('numeric')
  public goal: number

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResults')
  public owner: UserDTO

  @RelationId((keyResult: KeyResult) => keyResult.owner)
  public ownerId: UserDTO['id']

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveDTO

  @RelationId((keyResult: KeyResult) => keyResult.objective)
  public objectiveId: ObjectiveDTO['id']

  @ManyToOne('Team', 'keyResults')
  public team: TeamDTO

  @RelationId((keyResult: KeyResult) => keyResult.team)
  public teamId: TeamDTO['id']
}
