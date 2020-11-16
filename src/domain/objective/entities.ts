import { KeyResult } from 'domain/key-result/entities'
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Objective {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @OneToMany(() => KeyResult, (keyResult) => keyResult.objective)
  @JoinTable()
  public keyResults: KeyResult[]
}
