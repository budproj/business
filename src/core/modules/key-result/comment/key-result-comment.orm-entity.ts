import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultInterface } from '../interfaces/key-result.interface'

import { KeyResultCommentInterface } from './key-result-comment.interface'

@Entity()
export class KeyResultComment extends CoreEntity implements KeyResultCommentInterface {
  @Column({ type: 'text', nullable: true })
  public text: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column()
  @RelationId((keyResultComment: KeyResultComment) => keyResultComment.keyResult)
  public keyResultId: KeyResultInterface['id']

  @ManyToOne('KeyResult', 'comments')
  public keyResult: KeyResultInterface

  @Column()
  @RelationId((keyResultComment: KeyResultComment) => keyResultComment.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'keyResultComments')
  public user: UserInterface
}
