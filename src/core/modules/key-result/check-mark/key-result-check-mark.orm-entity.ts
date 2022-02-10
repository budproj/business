import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../interfaces/key-result.interface'

import { KeyResultCheckMarkInterface, CheckMarkStates } from './key-result-check-mark.interface'

@Entity()
export class KeyResultCheckMark extends CoreEntity implements KeyResultCheckMarkInterface {
  @Column({ type: 'simple-enum', enum: CheckMarkStates, default: CheckMarkStates.UNCHECKED })
  public state: CheckMarkStates

  @Column({ type: 'text' })
  public description: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ type: 'uuid' })
  @RelationId((checkMark: KeyResultCheckMark) => checkMark.keyResult)
  public keyResultId: KeyResultInterface['id']

  @ManyToOne('KeyResult', 'comments')
  public keyResult: KeyResultInterface

  @Column({ type: 'uuid' })
  @RelationId((checkMark: KeyResultCheckMark) => checkMark.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'keyResultComments')
  public user: UserInterface

  @Column({ type: 'uuid', nullable: true })
  @RelationId((checkMark: KeyResultCheckMark) => checkMark.assignedUser)
  public assignedUserId: UserInterface['id']

  @ManyToOne('User', 'keyResultAssignedCheckMarks')
  public assignedUser: UserInterface
}
