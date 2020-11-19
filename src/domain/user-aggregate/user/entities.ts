import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TeamDTO } from 'domain/company-aggregate/team/dto'
import { ConfidenceReportDTO } from 'domain/objective-aggregate/confidence-report/dto'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { ProgressReportDTO } from 'domain/objective-aggregate/progress-report/dto'

import { UserDTO } from './dto'

@Entity()
export class User implements UserDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public authzSub: string

  @Column({ nullable: true })
  public role: string

  @Column({ nullable: true })
  public picture: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToMany('Team', 'users')
  public teams: TeamDTO[]

  @OneToMany('KeyResult', 'owner')
  public keyResults: KeyResultDTO[]

  @OneToMany('ProgressReport', 'user')
  public progressReports: ProgressReportDTO[]

  @OneToMany('ConfidenceReport', 'user')
  public confidenceReports: ConfidenceReportDTO[]
}
