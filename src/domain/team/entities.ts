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

import { CycleDTO } from 'domain/cycle/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { TEAM_GENDER } from './constants'
import { TeamDTO } from './dto'

@Entity()
export class Team implements TeamDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name: string

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column({ type: 'enum', enum: TEAM_GENDER, nullable: true })
  public gender?: TEAM_GENDER

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('KeyResult', 'team')
  public keyResults: KeyResultDTO[]

  @ManyToMany('User', 'teams', { lazy: true })
  @JoinTable()
  public users: Promise<UserDTO[]>

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

  @OneToMany('Cycle', 'team')
  public cycles: CycleDTO[]
}
