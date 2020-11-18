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

import { ICompany } from 'domain/company-aggregate/company/dto'
import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'
import { IUser } from 'domain/user-aggregate/user/dto'

import { ITeam } from './dto'

@Entity()
export class Team implements ITeam {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Company', 'teams')
  public company: ICompany

  @OneToMany('KeyResult', 'team')
  public keyResults: IKeyResult[]

  @ManyToMany('User', 'teams')
  @JoinTable()
  public users: IUser[]
}
