import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamGender } from './enums/team-gender.enum'
import { TeamInterface } from './interfaces/team.interface'

@Entity()
export class Team extends CoreEntity implements TeamInterface {
  @Column()
  public name: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((team: Team) => team.owner)
  public ownerId: UserInterface['id']

  @ManyToOne('User', 'ownedTeams')
  public owner: UserInterface

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column({ type: 'simple-enum', enum: TeamGender, nullable: true })
  public gender?: TeamGender

  @Column({ nullable: true })
  @RelationId((team: Team) => team.parent)
  public parentId?: TeamInterface['id']

  @ManyToOne('Team', 'teams')
  public parent?: TeamInterface

  @OneToMany('Team', 'parent', { nullable: true })
  public teams?: TeamInterface[]

  @ManyToMany('User', 'teams', {
    lazy: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinTable()
  public users?: Promise<UserInterface[]>

  @OneToMany('Cycle', 'team', { nullable: true })
  public cycles?: CycleInterface[]

  @OneToMany('KeyResult', 'team', { nullable: true })
  public keyResults?: KeyResultInterface[]

  @OneToMany('Objective', 'team', { nullable: true })
  public objectives?: ObjectiveInterface[]
}
