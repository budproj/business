import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TeamDTO } from 'domain/company-aggregate/team/dto'
import { ConfidenceReportDTO } from 'domain/objective-aggregate/confidence-report/dto'
import { ObjectiveDTO } from 'domain/objective-aggregate/objective/dto'
import { ProgressReportDTO } from 'domain/objective-aggregate/progress-report/dto'
import { UserDTO } from 'domain/user-aggregate/user/dto'

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

  @ManyToOne('Objective', 'keyResults')
  public objective: ObjectiveDTO

  @ManyToOne('Team', 'keyResults')
  public team: TeamDTO

  @OneToMany('ProgressReport', 'keyResult')
  public progressReports: ProgressReportDTO[]

  @OneToMany('ConfidenceReport', 'keyResult')
  public confidenceReports: ConfidenceReportDTO[]
}
