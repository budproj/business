import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'domain/cycle/dto'
import { TeamDTO } from 'domain/team/dto'

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
