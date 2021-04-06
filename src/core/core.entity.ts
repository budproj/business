import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export abstract class CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @CreateDateColumn()
  public createdAt: Date
}
