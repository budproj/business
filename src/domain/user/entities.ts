import { Column, Entity, ManyToMany, OneToMany, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCustomListDTO } from 'src/domain/key-result/custom-list/dto'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { USER_GENDER } from 'src/domain/user/constants'

import { UserDTO } from './dto'

@Entity()
export class User extends DomainEntity implements UserDTO {
  @Column()
  public firstName: string

  @Column()
  public authzSub: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ nullable: true })
  public lastName?: string

  @Column({ type: 'enum', enum: USER_GENDER, nullable: true })
  public gender?: USER_GENDER

  @Column({ nullable: true })
  public role?: string

  @Column({ nullable: true })
  public picture?: string

  @ManyToMany('Team', 'users', { lazy: true, nullable: true })
  public teams?: Promise<TeamDTO[]>

  @OneToMany('Team', 'owner', { nullable: true })
  public ownedTeams?: TeamDTO[]

  @OneToMany('Objective', 'owner', { nullable: true })
  public objectives: ObjectiveDTO[]

  @OneToMany('KeyResult', 'owner', { nullable: true })
  public keyResults?: KeyResultDTO[]

  @OneToMany('KeyResultCustomList', 'user', { nullable: true })
  public keyResultCustomLists?: KeyResultCustomListDTO[]

  @OneToMany('KeyResultCheckIn', 'user')
  public keyResultCheckIns: KeyResultCheckInDTO[]
}
