import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { TEAM_GENDER } from './constants'
import { TeamDTO } from './dto'

@Entity()
export class Team implements TeamDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToMany('User', 'teams', { lazy: true, nullable: true })
  @JoinTable()
  public users?: Promise<UserDTO[]>

  @ManyToOne('User', 'ownedTeams')
  public owner: UserDTO

  @Column()
  @RelationId((team: Team) => team.owner)
  public ownerId: UserDTO['id']

  @Column({ nullable: true })
  @RelationId((team: Team) => team.parentTeam)
  public parentTeamId: TeamDTO['id']

  @ManyToOne('Team', 'teams')
  public parentTeam: TeamDTO

  @OneToMany('Team', 'parentTeam')
  public teams: TeamDTO[]

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column({ type: 'enum', enum: TEAM_GENDER, nullable: true })
  public gender?: TEAM_GENDER

  @OneToMany('Cycle', 'team', { nullable: true })
  public cycles?: CycleDTO[]

  @OneToMany('KeyResult', 'team', { nullable: true })
  public keyResults?: KeyResultDTO[]
}
