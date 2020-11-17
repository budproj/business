import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Company } from 'domain/company-aggregate/company/entities'
import { Objective } from 'domain/objective-aggregate/objective/entities'

@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne(() => Company, (company) => company.teams)
  public company: Company

  @OneToMany(() => Objective, (objective) => objective.cycle)
  @JoinTable()
  public objectives: Objective[]
}
