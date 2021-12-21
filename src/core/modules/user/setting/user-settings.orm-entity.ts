import { Entity, Column, UpdateDateColumn, RelationId, ManyToOne } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'
import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserInterface } from '@core/modules/user/user.interface'

@Entity()
export class UserSetting extends CoreEntity implements UserSettingInterface {
  @Column({ type: 'simple-enum', enum: Key })
  public key: Key

  @Column()
  public value: string

  @Column()
  @RelationId((settings: UserSetting) => settings.user)
  public userId: UserInterface['id']

  @ManyToOne('User', 'settings')
  public user: UserInterface

  @UpdateDateColumn()
  public updatedAt: Date
}
