import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { KeyResult } from 'domain/objective-aggregate/key-result/entities'
import { User } from 'domain/user-aggregate/user/entities'

@Entity()
export class ProgressReport {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('numeric')
  public valuePrevious: number

  @Column('numeric')
  public valueNew: number

  @ManyToOne(() => User, (user) => user.progressReports)
  public user: User

  @Column('text')
  public comment: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne(() => KeyResult, (keyResult) => keyResult.progressReports)
  public keyResult: KeyResult
}
