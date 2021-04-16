import { VisibilityStorageEnum } from '../enums/visilibity.enum'

export interface FilePolicyStorageInterface {
  write: VisibilityStorageEnum
  read: VisibilityStorageEnum
}
