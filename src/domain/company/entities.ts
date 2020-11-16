import { Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Team } from 'domain/team/entities'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id: number

  @OneToMany(() => Team, (team) => team.company)
  @JoinTable()
  public teams: Team[]
}
