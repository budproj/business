import {
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Cycle } from 'domain/cycle/entities'
import { Team } from 'domain/team/entities'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany(() => Team, (team) => team.company)
  @JoinTable()
  public teams: Team[]

  @OneToMany(() => Cycle, (cycle) => cycle.company)
  @JoinTable()
  public cycles: Cycle[]
}
