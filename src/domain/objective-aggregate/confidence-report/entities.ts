import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { User } from 'domain/user-aggregate/user/entities'

@Entity()
export class ConfidenceReport {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('numeric')
  public valuePrevious: number

  @Column('numeric')
  public valueNew: number

  @ManyToOne(() => User, (user) => user.confidenceReports)
  public user: User

  @Column('text')
  public comment: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne(() => KeyResult, (keyResult) => keyResult.confidenceReports)
  public keyResult: KeyResult
}
