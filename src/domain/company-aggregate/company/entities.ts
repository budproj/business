import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Cycle } from 'domain/company-aggregate/cycle/entities'
import { Team } from 'domain/company-aggregate/team/entities'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany(() => Team, (team) => team.company)
  public teams: Team[]

  @OneToMany(() => Cycle, (cycle) => cycle.company)
  public cycles: Cycle[]
}
