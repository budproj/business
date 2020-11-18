import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Team } from 'domain/company-aggregate/team/entities'
import { ConfidenceReport } from 'domain/objective-aggregate/confidence-report/entities'
import { Objective } from 'domain/objective-aggregate/objective/entities'
import { ProgressReport } from 'domain/objective-aggregate/progress-report/entities'
import { User } from 'domain/user-aggregate/user/entities'

@Entity()
export class KeyResult {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column()
  public description: string

  @Column('numeric')
  public initialValue: number

  @Column('numeric')
  public goal: number

  @ManyToOne(() => User, (user) => user.keyResults)
  public owner: User

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne(() => Objective, (objective) => objective.keyResults)
  public objective: Objective

  @ManyToOne(() => Team, (team) => team.keyResults)
  public team: Team

  @OneToMany(() => ProgressReport, (progressReport) => progressReport.keyResult)
  public progressReports: ProgressReport[]

  @OneToMany(() => ConfidenceReport, (confidenceReport) => confidenceReport.keyResult)
  public confidenceReports: ConfidenceReport[]
}
