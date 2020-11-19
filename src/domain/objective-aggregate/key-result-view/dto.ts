import { IKeyResult } from 'domain/objective-aggregate/key-result/dto'
import { IUser } from 'domain/user-aggregate/user/dto'

export enum IKeyResultViewBinding {
  MINE = 'MINE',
}

export interface IKeyResultView {
  id: number
  user: IUser['id']
  title: string
  binding: IKeyResultViewBinding
  rank: Array<IKeyResult['id']>
  createdAt: Date
  updatedAt: Date
}
