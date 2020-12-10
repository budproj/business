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

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'

@Entity()
export class Team implements TeamDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('KeyResult', 'team')
  public keyResults: KeyResultDTO[]

  @ManyToOne('Company', 'teams')
  public company: CompanyDTO

  @Column()
  @RelationId((team: Team) => team.company)
  public companyId: CompanyDTO['id']

  @ManyToMany('User', 'teams', { lazy: true })
  @JoinTable()
  public users: Promise<UserDTO[]>

  @ManyToOne('User', 'ownedTeams')
  public owner: UserDTO

  @Column()
  @RelationId((team: Team) => team.owner)
  public ownerId: UserDTO['id']
}
