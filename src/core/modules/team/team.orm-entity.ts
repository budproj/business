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

import { CoreEntity } from '@core/core.entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamGender } from './enums/team-gender.enum'
import { TeamInterface } from './team.interface'

@Entity('Team')
export class TeamORMEntity extends CoreEntity implements TeamInterface {
  @Column()
  public name: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((team: TeamInterface) => team.owner)
  public ownerId: UserInterface['id']

  @ManyToOne('UserORMEntity', 'ownedTeams')
  public owner: UserInterface

  @Column({ type: 'text', nullable: true })
  public description?: string | null

  @Column({ type: 'simple-enum', enum: TeamGender, nullable: true })
  public gender?: TeamGender

  @Column({ nullable: true })
  @RelationId((team: TeamInterface) => team.parent)
  public parentId?: TeamInterface['id']

  @ManyToOne('TeamORMEntity', 'teams')
  public parent?: TeamInterface

  @OneToMany('TeamORMEntity', 'parent', { nullable: true })
  public teams?: TeamInterface[]

  @ManyToMany('UserORMEntity', 'teams', { lazy: true, nullable: true })
  @JoinTable()
  public users?: Promise<UserInterface[]>
}
