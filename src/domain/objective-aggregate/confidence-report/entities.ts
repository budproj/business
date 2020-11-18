import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'
import { IUser } from 'domain/user-aggregate/user/dto'

import { IConfidenceReport } from './dto'

@Entity()
export class ConfidenceReport implements IConfidenceReport {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('numeric')
  public valuePrevious: number

  @Column('numeric')
  public valueNew: number

  @Column('text')
  public comment: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne('User', 'confidenceReports')
  public user: IUser

  @ManyToOne('KeyResult', 'confidenceReports')
  public keyResult: IKeyResult
}
