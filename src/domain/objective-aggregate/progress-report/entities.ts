import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { UserDTO } from 'domain/user-aggregate/user/dto'

import { ProgressReportDTO } from './dto'

@Entity()
export class ProgressReport implements ProgressReportDTO {
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

  @ManyToOne('User', 'progressReports')
  public user: UserDTO

  @ManyToOne('KeyResult', 'progressReports')
  public keyResult: KeyResultDTO
}
