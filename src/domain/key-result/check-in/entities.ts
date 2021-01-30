import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  @RelationId((progressReport: KeyResultCheckIn) => progressReport.keyResult)
  public keyResultId: KeyResultDTO['id']

  @ManyToOne('User', 'keyResultCheckIns')
  public user: UserDTO

  @Column()
  @RelationId((progressReport: KeyResultCheckIn) => progressReport.user)
  public userId: UserDTO['id']

  @Column({ type: 'text', nullable: true })
  public comment?: string
}
