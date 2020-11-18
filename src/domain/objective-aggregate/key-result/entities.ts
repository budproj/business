import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ITeam } from 'domain/company-aggregate/team/dto'
import { IConfidenceReport } from 'domain/objective-aggregate/confidence-report/dto'
import { IObjective } from 'domain/objective-aggregate/objective/dto'
import { IProgressReport } from 'domain/objective-aggregate/progress-report/dto'
import { IUser } from 'domain/user-aggregate/user/dto'

import { IKeyResult } from './dto'

@Entity()
export class KeyResult implements IKeyResult {
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
  public owner: IUser

  @ManyToOne('Objective', 'keyResults')
  public objective: IObjective

  @ManyToOne('Team', 'keyResults')
  public team: ITeam

  @OneToMany('ProgressReport', 'keyResult')
  public progressReports: IProgressReport[]

  @OneToMany('ConfidenceReport', 'keyResult')
  public confidenceReports: IConfidenceReport[]
}
