import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Company } from 'domain/company/entities'

@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @ManyToOne(() => Company, (company) => company.teams)
  public company: Company
}
