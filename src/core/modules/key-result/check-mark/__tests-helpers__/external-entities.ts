import { Column, Entity } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'

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
