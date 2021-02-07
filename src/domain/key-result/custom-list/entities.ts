import { Column, Entity, ManyToOne, RelationId, Unique, UpdateDateColumn } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KEY_RESULT_CUSTOM_LIST_BINDING } from './constants'
import { KeyResultCustomListDTO } from './dto'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultCustomList extends DomainEntity implements KeyResultCustomListDTO {
  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResultCustomLists')
  public user: UserDTO

  @Column()
  @RelationId((keyResultCustomList: KeyResultCustomList) => keyResultCustomList.user)
  public userId: UserDTO['id']

  @Column({ nullable: true })
  public title?: string

  @Column({ type: 'simple-enum', enum: KEY_RESULT_CUSTOM_LIST_BINDING, nullable: true })
  public binding?: KEY_RESULT_CUSTOM_LIST_BINDING

  @Column('uuid', { array: true, nullable: true })
  public rank?: Array<KeyResultDTO['id']>
}
