import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'

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

  @OneToMany('KeyResult', 'team')
  public keyResults: KeyResultDTO[]
}
