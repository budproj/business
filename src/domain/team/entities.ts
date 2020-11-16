import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Company } from 'domain/company/entities'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @ManyToOne(() => Company, (company) => company.teams)
  public company: Company
}
