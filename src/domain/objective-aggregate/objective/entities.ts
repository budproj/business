import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { ICycle } from 'domain/company-aggregate/cycle/dto'
import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'

import { IObjective } from './dto'

@Entity()
export class Objective implements IObjective {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany('KeyResult', 'objective')
  public keyResults: IKeyResult[]

  @ManyToOne('Cycle', 'objectives')
  public cycle: ICycle
}
