import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { ObjectiveDTO } from 'domain/objective/dto'

import { CycleDTO } from './dto'

@Entity()
export class Cycle implements CycleDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Company', 'teams')
  public company: CompanyDTO

  @Column()
  @RelationId((team: Cycle) => team.company)
  public companyId: CompanyDTO['id']

  @OneToMany('Objective', 'cycle')
  public objectives: ObjectiveDTO[]
}
