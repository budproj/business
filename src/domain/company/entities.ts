import { Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Team } from 'domain/team/entities'
import { Cycle } from 'domain/cycle/entities'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number

  @OneToMany(() => Team, (team) => team.company)
  @JoinTable()
  public teams: Team[]

  @OneToMany(() => Cycle, (cycle) => cycle.company)
  @JoinTable()
  public cycles: Cycle[]
}
