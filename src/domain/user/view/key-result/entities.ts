import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { KEY_RESULT_VIEW_BINDING } from './constants'
import { KeyResultViewDTO } from './dto'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultView implements KeyResultViewDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ nullable: true })
  public title?: string

  @Column({ type: 'enum', enum: KEY_RESULT_VIEW_BINDING, nullable: true })
  public binding?: KEY_RESULT_VIEW_BINDING

  @Column('uuid', { array: true, nullable: true })
  public rank?: Array<KeyResultDTO['id']>

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResultViews')
  public user: UserDTO

  @Column()
  @RelationId((keyResultView: KeyResultView) => keyResultView.user)
  public userId: UserDTO['id']
}
