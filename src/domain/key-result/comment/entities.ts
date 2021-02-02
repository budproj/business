import { Column, Entity, ManyToOne, RelationId, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCommentDTO } from './dto'

@Entity()
export class KeyResultComment extends DomainEntity implements KeyResultCommentDTO {
  @Column({ type: 'text', nullable: true })
  public text: string

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('KeyResult', 'checkIns')
  public keyResult: KeyResultDTO

  @Column()
  @RelationId((progressReport: KeyResultComment) => progressReport.keyResult)
  public keyResultId: KeyResultDTO['id']

  @ManyToOne('User', 'keyResultComments')
  public user: UserDTO

  @Column()
  @RelationId((progressReport: KeyResultComment) => progressReport.user)
  public userId: UserDTO['id']
}
