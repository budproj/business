import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

import { ConfidenceReportDTO } from './dto'

@Entity()
export class ConfidenceReport implements ConfidenceReportDTO {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ nullable: true })
  public valuePrevious?: number

  @Column()
  public valueNew: number

  @Column({ type: 'text', nullable: true })
  public comment?: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne('KeyResult', 'confidenceReports')
  public keyResult: KeyResultDTO

  @Column()
  @RelationId((progressReport: ConfidenceReport) => progressReport.keyResult)
  public keyResultId: KeyResultDTO['id']

  @ManyToOne('User', 'confidenceReports')
  public user: UserDTO

  @Column()
  @RelationId((progressReport: ConfidenceReport) => progressReport.user)
  public userId: UserDTO['id']
}
