import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { IUser } from 'domain/user-aggregate/user/dto'

import { IKeyResultView, IKeyResultViewBinding } from './dto'

@Entity()
@Unique(['user', 'binding'])
export class KeyResultView implements IKeyResultView {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ nullable: true })
  public title: string

  @Column({ type: 'enum', enum: IKeyResultViewBinding, nullable: true })
  public binding: IKeyResultViewBinding

  @Column({ type: 'simple-array', default: [] })
  public rank: number[]

  @CreateDateColumn()
  public createdAt: Date

  @UpdateDateColumn()
  public updatedAt: Date

  @ManyToOne('User', 'keyResultViews')
  public user: IUser['id']
}
