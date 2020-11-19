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

import { CompanyDTO } from 'domain/company-aggregate/company/dto'
import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { UserDTO } from 'domain/user-aggregate/user/dto'

import { TeamDTO } from './dto'

@Entity()
export class Team implements TeamDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Company', 'teams')
  public company: CompanyDTO

  @OneToMany('KeyResult', 'team')
  public keyResults: KeyResultDTO[]

  @ManyToMany('User', 'teams')
  @JoinTable()
  public users: UserDTO[]
}
