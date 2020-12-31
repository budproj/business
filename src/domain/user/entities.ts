import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'
import { USER_GENDER } from 'domain/user/constants'

import { UserDTO } from './dto'

@Entity()
export class User implements UserDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name: string

  @Column()
  public authzSub: string

  @Column({ type: 'enum', enum: USER_GENDER, nullable: true })
  public gender?: USER_GENDER

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

  @OneToMany('Objective', 'owner')
  public objectives: ObjectiveDTO[]

  @OneToMany('ConfidenceReport', 'user')
  public confidenceReports: ConfidenceReportDTO[]

  @OneToMany('ProgressReport', 'user')
  public progressReports: ProgressReportDTO[]

  @ManyToMany('Team', 'users', { lazy: true })
  public teams: Promise<TeamDTO[]>

  @OneToMany('Team', 'owner')
  public ownedTeams: TeamDTO[]
}
