import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Team } from 'domain/company-aggregate/team/entities'
import { ConfidenceReport } from 'domain/objective-aggregate/confidence-report'
import { KeyResult } from 'domain/objective-aggregate/key-result'
import { ProgressReport } from 'domain/objective-aggregate/progress-report'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public authzID: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToMany(() => Team, (team) => team.users)
  public teams: Team[]

  @OneToMany(() => KeyResult, (keyResult) => keyResult.owner)
  public keyResults: KeyResult[]

  @OneToMany(() => ProgressReport, (progressReport) => progressReport.user)
  public progressReports: ProgressReport[]

  @OneToMany(() => ConfidenceReport, (confidenceReport) => confidenceReport.user)
  public confidenceReports: ConfidenceReport[]
}
