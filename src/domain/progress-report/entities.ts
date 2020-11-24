import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'

import { ProgressReportDTO } from './dto'

@Entity()
export class ProgressReport implements ProgressReportDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ type: 'numeric', nullable: true })
  public valuePrevious?: number

  @Column('numeric')
  public valueNew: number

  @Column({ type: 'text', nullable: true })
  public comment?: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne('KeyResult', 'progressReports')
  public keyResult: KeyResultDTO

  @RelationId((progressReport: ProgressReport) => progressReport.keyResult)
  public keyResultId: KeyResultDTO['id']
}
