import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
// Import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { ObjectiveDTO } from './dto'

@Entity()
export class Objective implements ObjectiveDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public title: string

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  // @OneToMany('KeyResult', 'objective')
  // public keyResults: KeyResultDTO[]
  //
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
