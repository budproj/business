import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'domain/company-aggregate/cycle/dto'
import { TeamDTO } from 'domain/company-aggregate/team/dto'

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
}
