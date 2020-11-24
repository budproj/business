import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ConfidenceReportDTO } from 'domain/confidence-report/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ProgressReportDTO } from 'domain/progress-report/dto'
import { TeamDTO } from 'domain/team/dto'

import { UserDTO } from './dto'

@Entity()
export class User implements UserDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public authzSub: string

  @Column({ nullable: true })
  public role?: string

  @Column({ nullable: true })
  public picture?: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('KeyResult', 'owner')
  public keyResults: KeyResultDTO[]

  @OneToMany('ConfidenceReport', 'user')
  public confidenceReports: ConfidenceReportDTO[]

  @OneToMany('ProgressReport', 'user')
  public progressReports: ProgressReportDTO[]

  @ManyToMany('Team', 'users', { lazy: true })
  public teams: TeamDTO[]
}
