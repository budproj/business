import { Column, Entity, ManyToMany, OneToMany, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/modules/check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from '@core/modules/key-result/modules/comment/key-result-comment.interface'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'

import { UserGender } from './enums/user-gender.enum'
import { UserInterface } from './user.interface'

@Entity()
export class User extends CoreEntity implements UserInterface {
  @Column()
  public firstName: string

  @Column()
  public authzSub: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ nullable: true })
  public lastName?: string

  @Column({ type: 'simple-enum', enum: UserGender, nullable: true })
  public gender?: UserGender

  @Column({ nullable: true })
  public role?: string

  @Column({ nullable: true })
  public picture?: string

  @Column({ nullable: true })
  public nickname?: string

  @Column({ type: 'text', nullable: true })
  public about?: string

  @Column({ nullable: true })
  public linkedInProfileAddress?: string

  @ManyToMany('Team', 'users', { lazy: true, nullable: true })
  public teams?: Promise<TeamInterface[]>

  @OneToMany('Team', 'owner', { nullable: true })
  public ownedTeams?: TeamInterface[]

  @OneToMany('Objective', 'owner', { nullable: true })
  public objectives: ObjectiveInterface[]

  @OneToMany('KeyResult', 'owner', { nullable: true })
  public keyResults?: KeyResultInterface[]

  @OneToMany('KeyResultComment', 'user', { nullable: true })
  public keyResultComments?: KeyResultCommentInterface[]

  @OneToMany('KeyResultCheckIn', 'user', { nullable: true })
  public keyResultCheckIns?: KeyResultCheckInInterface[]
}
