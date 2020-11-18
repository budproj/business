import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ITeam } from 'domain/company-aggregate/team/dto'
import { IConfidenceReport } from 'domain/objective-aggregate/confidence-report/dto'
import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'
import { IProgressReport } from 'domain/objective-aggregate/progress-report/dto'

import { IUser } from './dto'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public authzSub: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToMany('Team', 'users')
  public teams: ITeam[]

  @OneToMany('KeyResult', 'owner')
  public keyResults: IKeyResult[]

  @OneToMany('ProgressReport', 'user')
  public progressReports: IProgressReport[]

  @OneToMany('ConfidenceReport', 'user')
  public confidenceReports: IConfidenceReport[]
}
