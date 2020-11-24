import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'

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
}
