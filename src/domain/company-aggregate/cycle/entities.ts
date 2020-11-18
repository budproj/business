import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ICompany } from 'domain/company-aggregate/company/dto'
import { IObjective } from 'domain/objective-aggregate/objective/dto'

import { ICycle } from './dto'

@Entity()
export class Cycle implements ICycle {
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

  @ManyToOne('Company', 'cycle')
  public company: ICompany

  @OneToMany('Objective', 'cycle')
  public objectives: IObjective[]
}
