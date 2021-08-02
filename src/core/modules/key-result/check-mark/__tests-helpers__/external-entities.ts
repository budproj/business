import { CoreEntity } from "@core/core.orm-entity"
import { Column, Entity } from "typeorm"

@Entity()
export class User extends CoreEntity {
  @Column()
  firstName: string

  keyResultComments: string[]
}

@Entity()
export class KeyResult extends CoreEntity {
  @Column()
  title: string
}
