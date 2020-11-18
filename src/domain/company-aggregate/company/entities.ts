import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ICycle } from 'domain/company-aggregate/cycle/dto'
import { ITeam } from 'domain/company-aggregate/team/dto'

import { ICompany } from './dto'

@Entity()
export class Company implements ICompany {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('Team', 'company')
  public teams: ITeam[]

  @OneToMany('Cycle', 'company')
  public cycles: ICycle[]
}
