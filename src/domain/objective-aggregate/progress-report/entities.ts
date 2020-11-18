import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'
import { IUser } from 'domain/user-aggregate/user/dto'

import { IProgressReport } from './dto'

@Entity()
export class ProgressReport implements IProgressReport {
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

  @ManyToOne('User', 'progressReports')
  public user: IUser

  @ManyToOne('KeyResult', 'progressReports')
  public keyResult: IKeyResult
}
