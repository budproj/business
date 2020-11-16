import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { KeyResult } from 'domain/key-result/entities'

@Entity()
export class ProgressReport {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('numeric')
  public valuePrevious: number

  @Column('numeric')
  public valueNew: number

  @Column()
  public user: string

  @Column('text')
  public comment: string

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne(() => KeyResult, (keyResult) => keyResult.progressReports)
  public keyResult: KeyResult
}
