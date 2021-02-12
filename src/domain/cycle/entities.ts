import { Column, Entity, ManyToOne, OneToMany, RelationId, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'

import { CycleDTO } from './dto'

@Entity()
export class Cycle extends DomainEntity implements CycleDTO {
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

  @Column({ nullable: true })
  public name?: string

  @OneToMany('Objective', 'cycle')
  public objectives?: ObjectiveDTO[]
}
