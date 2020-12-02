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

import { UserDTO } from 'domain/user/dto'

import { KeyResultViewDTO } from './dto'
import { KeyResultViewBinding } from './types'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultView implements KeyResultViewDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ nullable: true })
  public title?: string

  @Column({ type: 'enum', enum: KeyResultViewBinding, nullable: true })
  public binding?: KeyResultViewBinding

  @Column({ type: 'simple-array', default: [] })
  public rank: number[]

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
