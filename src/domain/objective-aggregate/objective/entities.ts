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

import { Cycle } from 'domain/company-aggregate/cycle/entities'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'

@Entity()
export class Objective {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @OneToMany(() => KeyResult, (keyResult) => keyResult.objective)
  @JoinTable()
  public keyResults: KeyResult[]

  @ManyToOne(() => Cycle, (cycle) => cycle.objectives)
  public cycle: Cycle
}
