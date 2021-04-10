import { Column, Entity, ManyToOne, OneToMany, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { TeamInterface } from '@core/modules/team/team.interface'

import { CycleInterface } from './cycle.interface'
import { Cadence } from './enums/cadence.enum'

@Entity()
export class Cycle extends CoreEntity implements CycleInterface {
  @Column()
  public period: string

  @Column({ type: 'simple-enum', enum: Cadence })
  public cadence: Cadence

  @Column({ default: true })
  public active: boolean

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((cycle: Cycle) => cycle.team)
  public teamId: TeamInterface['id']

  @ManyToOne('Team', 'cycles')
  public team: TeamInterface

  @Column({ nullable: true })
  @RelationId((cycle: Cycle) => cycle.parent)
  public parentId?: CycleInterface['id']

  @ManyToOne('Cycle', 'cycles', { nullable: true })
  public parent?: CycleInterface

  @OneToMany('Cycle', 'parent', { nullable: true })
  public cycles?: CycleInterface[]
}
