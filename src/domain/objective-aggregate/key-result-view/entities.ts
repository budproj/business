import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { UserDTO } from 'domain/user-aggregate/user/dto'

import { KeyResultViewDTO, KeyResultViewBinding } from './dto'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultView implements KeyResultViewDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ nullable: true })
  public title: string

  @Column({ type: 'enum', enum: KeyResultViewBinding, nullable: true })
  public binding: KeyResultViewBinding

  @Column({ type: 'simple-array', default: [] })
  public rank: number[]

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResultViews')
  public user: UserDTO['id']
}
