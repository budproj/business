import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../interfaces/key-result.interface'

import { CheckMarkInterface, CheckMarkStates } from './check-mark.interface'

@Entity()
export class CheckMark extends CoreEntity implements CheckMarkInterface {
  @Column({ type: 'simple-enum', enum: CheckMarkStates, default: CheckMarkStates.UNCHECKED })
  public state: CheckMarkStates

  @Column({ type: 'text' })
  public description: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ type: 'uuid' })
  @RelationId((checkMark: CheckMark) => checkMark.keyResult)
  public keyResultId: KeyResultInterface['id']

  @ManyToOne('KeyResult', 'comments')
  public keyResult: KeyResultInterface

  @Column({ type: 'uuid' })
  @RelationId((checkMark: CheckMark) => checkMark.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'keyResultComments')
  public user: UserInterface
}
