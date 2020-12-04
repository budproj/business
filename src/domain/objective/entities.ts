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

import { CycleDTO } from 'domain/cycle/dto'
import { KeyResultDTO } from 'domain/key-result/dto'

import { ObjectiveDTO } from './dto'
import { UserDTO } from 'domain/user'

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

  @Column()
  @RelationId((objective: Objective) => objective.cycle)
  public cycleId: CycleDTO['id']

  @ManyToOne('User', 'objectives')
  public owner: UserDTO

  @Column()
  @RelationId((objective: Objective) => objective.owner)
  public ownerId: UserDTO['id']
}
