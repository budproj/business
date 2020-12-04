import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'domain/cycle/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { CompanyDTO } from './dto'

@Entity()
export class Company implements CompanyDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('Team', 'company')
  public teams: TeamDTO[]

  @OneToMany('Cycle', 'company')
  public cycles: CycleDTO[]

  @ManyToOne('User', 'ownedCompanies')
  public owner: UserDTO

  @Column()
  @RelationId((company: Company) => company.owner)
  public ownerId: UserDTO['id']
}
