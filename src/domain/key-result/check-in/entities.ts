import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckInDTO } from './dto'

@Entity()
export class KeyResultCheckIn implements KeyResultCheckInDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ type: 'real' })
  public progress: number

  @Column()
  public confidence: number

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne('KeyResult', 'checkIns')
  public keyResult: KeyResultDTO

  @Column()
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.keyResult)
  public keyResultId: KeyResultDTO['id']

  @ManyToOne('User', 'keyResultCheckIns')
  public user: UserDTO

  @Column()
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.user)
  public userId: UserDTO['id']

  @Column({ type: 'text', nullable: true })
  public comment?: string

  @OneToOne('KeyResultCheckIn', 'id', { nullable: true })
  @JoinColumn()
  public parent?: KeyResultCheckInDTO

  @Column({ nullable: true })
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.parent)
  public parentId?: KeyResultCheckInDTO['id']
}
