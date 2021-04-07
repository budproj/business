import { Column, Entity, ManyToMany, OneToMany, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.entity'
import { TeamInterface } from '@core/modules/team/team.interface'

import { UserGender } from './enums/user-gender.enum'
import { UserInterface } from './user.interface'

@Entity('User')
export class UserORMEntity extends CoreEntity implements UserInterface {
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

  @ManyToMany('TeamORMEntity', 'users', { lazy: true, nullable: true })
  public teams?: Promise<TeamInterface[]>

  @OneToMany('TeamORMEntity', 'owner', { nullable: true })
  public ownedTeams?: TeamInterface[]
}
