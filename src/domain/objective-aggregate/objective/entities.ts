import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'domain/company-aggregate/cycle/dto'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'

import { ObjectiveDTO } from './dto'

@Entity()
export class Objective implements ObjectiveDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('KeyResult', 'objective')
  public keyResults: KeyResultDTO[]

  @ManyToOne('Cycle', 'objectives')
  public cycle: CycleDTO
}
