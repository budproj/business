import { Column, Entity, ManyToOne, OneToMany, RelationId, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'

import { CADENCE } from './constants'
import { CycleDTO } from './dto'

@Entity()
export class Cycle extends DomainEntity implements CycleDTO {
  @Column()
  public title: string

  @Column({ type: 'simple-enum', enum: CADENCE })
  public cadence: CADENCE

  @Column({ default: true })
  public active: boolean

  @Column()
  public dateStart: Date

  @Column()
  public dateEnd: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('Team', 'cycles')
  public team: TeamDTO

  @Column()
  @RelationId((cycle: Cycle) => cycle.team)
  public teamId: TeamDTO['id']

  @ManyToOne('Cycle', 'cycles', { nullable: true })
  public parent?: CycleDTO

  @Column({ nullable: true })
  @RelationId((cycle: Cycle) => cycle.parent)
  public parentId?: CycleDTO['id']

  @OneToMany('Objective', 'cycle', { nullable: true })
  public objectives?: ObjectiveDTO[]

  @OneToMany('Cycle', 'parent', { nullable: true })
  public cycles?: CycleDTO[]
}
