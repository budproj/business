import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Company } from 'domain/company-aggregate/company/entities'
import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { User } from 'domain/user-aggregate/user/entities'

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
  public keyResults: KeyResult[]

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable()
  public users: User[]
}
