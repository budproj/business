import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CompanyDTO } from 'domain/company-aggregate/company/dto'
import { ObjectiveDTO } from 'domain/objective-aggregate/objective/dto'

import { CycleDTO } from './dto'

@Entity()
export class Cycle implements CycleDTO {
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
  public company: CompanyDTO

  @OneToMany('Objective', 'cycle')
  public objectives: ObjectiveDTO[]
}
