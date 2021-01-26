import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { TeamDTO } from 'src/domain/team/dto'

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

  @Column({ nullable: true })
  public name?: string
}
