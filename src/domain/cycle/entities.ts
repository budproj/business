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

import { ObjectiveDTO } from 'domain/objective/dto'
import { TeamDTO } from 'domain/team/dto'

import { CycleDTO } from './dto'

@Entity()
export class Cycle implements CycleDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Team', 'cycles')
  public team: TeamDTO

  @Column()
  @RelationId((cycle: Cycle) => cycle.team)
  public teamId: TeamDTO['id']

  @OneToMany('Objective', 'cycle')
  public objectives: ObjectiveDTO[]
}
