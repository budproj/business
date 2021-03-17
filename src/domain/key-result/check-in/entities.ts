import { Column, Entity, JoinColumn, ManyToOne, OneToOne, RelationId } from 'typeorm'

import { DomainEntity } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckInDTO } from './dto'

@Entity()
export class KeyResultCheckIn extends DomainEntity implements KeyResultCheckInDTO {
  @Column({ type: 'real' })
  public value: number

  @Column()
  public confidence: number

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

  @OneToOne('KeyResultCheckIn', 'id', { nullable: true })
  @JoinColumn()
  public parent?: KeyResultCheckInDTO

  @Column({ nullable: true })
  @RelationId((keyResultCheckIn: KeyResultCheckIn) => keyResultCheckIn.parent)
  public parentId?: KeyResultCheckInDTO['id']
}
