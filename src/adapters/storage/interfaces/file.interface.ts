import { FilePolicyStorageInterface } from './file-policy.interface'

export interface FileStorageInterface {
  name: string
  type: string
  encoding: string
  extension: string
  tmpPath: string
  content: ArrayBuffer
  path?: string
  policy?: FilePolicyStorageInterface
}
