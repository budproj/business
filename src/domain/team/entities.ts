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

import { Company } from 'domain/company/entities'
import { KeyResult } from 'domain/key-result/entities'

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne(() => Company, (company) => company.teams)
  public company: Company

  @OneToMany(() => KeyResult, (keyResult) => keyResult.team)
  @JoinTable()
  public keyResults: KeyResult[]
}
