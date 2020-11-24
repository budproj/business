import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: true })
  public ownerId: UserDTO['id']

  @Column({ nullable: true })
  public objectiveId: UserDTO['id']

  @Column({ nullable: true })
  public teamId: TeamDTO['id']

  @ManyToOne('User', 'keyResults')
  public owner: UserDTO

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveDTO

  @ManyToOne('Team', 'keyResults')
  public team: TeamDTO
}
