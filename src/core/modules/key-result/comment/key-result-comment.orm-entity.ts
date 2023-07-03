import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultCommentType } from '../enums/key-result-comment-type.enum'
import { KeyResultInterface } from '../interfaces/key-result.interface'

import { KeyResultCommentInterface } from './key-result-comment.interface'

@Entity()
export class KeyResultComment extends CoreEntity implements KeyResultCommentInterface {
  @Column({ type: 'text', nullable: true })
  public text: string

  @UpdateDateColumn()
  public updatedAt: Date

  @Column({ default: KeyResultCommentType.comment })
  public type: KeyResultCommentType

  @Column({ type: 'json', nullable: true })
  public extra?: JSON

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

  @Column({ nullable: true })
  @RelationId((keyResultComment: KeyResultComment) => keyResultComment.parent)
  public parentId?: KeyResultCommentInterface['id']

  @ManyToOne('KeyResultComment', 'keyResultComment', {
    lazy: true,
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  public parent?: KeyResultCommentInterface
}
