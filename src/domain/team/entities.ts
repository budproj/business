import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainEntity } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { TEAM_GENDER } from './constants'
import { TeamDTO } from './dto'

@Entity()
export class Team extends DomainEntity implements TeamDTO {
  @Column()
  public name: string

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

  @Column({ type: 'simple-enum', enum: TEAM_GENDER, nullable: true })
  public gender?: TEAM_GENDER

  @OneToMany('Cycle', 'team', { nullable: true })
  public cycles?: CycleDTO[]

  @OneToMany('KeyResult', 'team', { nullable: true })
  public keyResults?: KeyResultDTO[]
}
