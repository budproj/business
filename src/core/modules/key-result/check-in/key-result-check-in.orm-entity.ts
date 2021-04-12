import { Column, Entity, JoinColumn, ManyToOne, OneToOne, RelationId } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../key-result.interface'

import { KeyResultCheckInInterface } from './key-result-check-in.interface'

@Entity()
export class KeyResultCheckIn extends CoreEntity implements KeyResultCheckInInterface {
  @Column({ type: 'real' })
  public value: number

  @Column()
  public confidence: number

  @Column()
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.keyResult)
  public keyResultId: KeyResultInterface['id']

  @ManyToOne('KeyResult', 'checkIns')
  public keyResult: KeyResultInterface

  @Column()
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'keyResultCheckIns')
  public user: UserInterface

  @Column({ type: 'text', nullable: true })
  public comment?: string

  @Column({ nullable: true })
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.parent)
  public parentId?: KeyResultCheckInInterface['id']

  @OneToOne('KeyResultCheckIn', 'id', { nullable: true })
  @JoinColumn()
  public parent?: KeyResultCheckInInterface
}
