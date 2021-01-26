import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

// import { KeyResultDTO } from 'src/domain/key-result/dto'
// import { ConfidenceReportDTO } from 'src/domain/key-result/report/confidence/dto'
// import { ProgressReportDTO } from 'src/domain/key-result/report/progress/dto'
// import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { USER_GENDER } from 'src/domain/user/constants'

import { UserDTO } from './dto'
// import { KeyResultCustomListDTO } from 'src/domain/key-result/custom-list/dto'
//
@Entity()
export class User implements UserDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public firstName: string

  @Column()
  public authzSub: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ nullable: true })
  public lastName?: string

  @Column({ type: 'enum', enum: USER_GENDER, nullable: true })
  public gender?: USER_GENDER

  @Column({ nullable: true })
  public role?: string

  @Column({ nullable: true })
  public picture?: string

  @ManyToMany('Team', 'users', { lazy: true, nullable: true })
  public teams?: Promise<TeamDTO[]>

  @OneToMany('Team', 'owner', { nullable: true })
  public ownedTeams?: TeamDTO[]
  //
  // @OneToMany('KeyResultCustomList', 'user')
  // public keyResultCustomLists: KeyResultCustomListDTO[]

  // @OneToMany('KeyResult', 'owner')
  // public keyResults: KeyResultDTO[]
  //
  // @OneToMany('Objective', 'owner')
  // public objectives: ObjectiveDTO[]
  //
  // @OneToMany('ConfidenceReport', 'user')
  // public confidenceReports: ConfidenceReportDTO[]
  //
  // @OneToMany('ProgressReport', 'user')
  // public progressReports: ProgressReportDTO[]
}
