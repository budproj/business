import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { UserDTO } from 'domain/user-aggregate/user/dto'

import { ConfidenceReportDTO } from './dto'

@Entity()
export class ConfidenceReport implements ConfidenceReportDTO {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('numeric')
  public valuePrevious: number

  @Column('numeric')
  public valueNew: number

  @Column({ type: 'text', nullable: true })
  public comment?: string | null

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne('User', 'confidenceReports')
  public user: UserDTO

  @ManyToOne('KeyResult', 'confidenceReports')
  public keyResult: KeyResultDTO
}
