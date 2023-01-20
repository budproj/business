import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'

import { UserInterface } from '../user/user.interface'

import { TaskInterface, TaskStates } from './task.interface'

@Entity()
export class Task extends CoreEntity implements TaskInterface {
  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: 'uuid' })
  @RelationId((task: Task) => task.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'keyResultComments')
  public user: UserInterface

  @Column({ type: 'uuid', nullable: true })
  @RelationId((task: Task) => task.assignedUser)
  public assignedUserId: UserInterface['id']

  @ManyToOne('User', 'assignedTasks')
  public assignedUser: UserInterface

  @Column({ type: 'text' })
  public description: string

  @Column({ type: 'simple-enum', enum: TaskStates, default: TaskStates.UNCHECKED })
  public state: TaskStates
}
