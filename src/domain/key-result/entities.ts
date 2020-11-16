import { Objective } from 'domain/objective/entities'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class KeyResult {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column()
  public description: string

  @Column('numeric')
  public goal: number

  @CreateDateColumn()
  public createdAt: Date

  @ManyToOne(() => Objective, (objective) => objective.keyResults)
  public objective: Objective
}
