import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ConfidenceReport } from 'domain/confidence-report/entities'
import { Objective } from 'domain/objective/entities'
import { ProgressReport } from 'domain/progress-report/entities'
import { Team } from 'domain/team/entities'

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

  @Column()
  public owner: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne(() => Objective, (objective) => objective.keyResults)
  public objective: Objective

  @ManyToOne(() => Team, (team) => team.keyResults)
  public team: Team

  @OneToMany(() => ProgressReport, (progressReport) => progressReport.keyResult)
  @JoinTable()
  public progressReports: ProgressReport[]

  @OneToMany(() => ConfidenceReport, (confidenceReport) => confidenceReport.keyResult)
  @JoinTable()
  public confidenceReports: ConfidenceReport[]
}
