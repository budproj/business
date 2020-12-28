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

import { KeyResultViewDTO } from './dto'
import { KeyResultViewBinding } from './types'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultView implements KeyResultViewDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ nullable: true })
  public title?: string

  @Column({ type: 'enum', enum: KeyResultViewBinding, nullable: true })
  public binding?: KeyResultViewBinding

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
