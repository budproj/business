import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'

import { Author } from '../interfaces/key-result-author.interface'
import { KeyResultPatchInterface } from '../interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '../interfaces/key-result-state.interface'
import { KeyResultInterface } from '../interfaces/key-result.interface'

import { KeyResultUpdateInterface } from './key-result-update.interface'

@Entity()
@Index(['keyResultId', 'createdAt'])
export class KeyResultUpdate extends CoreEntity implements KeyResultUpdateInterface {
  @Column()
  @RelationId((keyResultUpdate: KeyResultUpdate) => keyResultUpdate.keyResult)
  public keyResultId: KeyResultInterface['id']

  @ManyToOne('KeyResult', 'updates')
  public keyResult: KeyResultInterface

  @Column({ type: 'jsonb' })
  public author: Author

  @Column({ type: 'jsonb' })
  public oldState: KeyResultStateInterface

  @Column({ type: 'jsonb' })
  public patches: KeyResultPatchInterface[]

  @Column({ type: 'jsonb' })
  public newState: KeyResultStateInterface
}
