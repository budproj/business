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

import { COMPANY_GENDER } from 'domain/company/constants'
import { CycleDTO } from 'domain/cycle/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { CompanyDTO } from './dto'

@Entity()
export class Company implements CompanyDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public name: string

  @Column({ type: 'enum', enum: COMPANY_GENDER, nullable: true })
  public gender?: COMPANY_GENDER

  @Column({ type: 'text', nullable: true })
  public description?: string | null

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
