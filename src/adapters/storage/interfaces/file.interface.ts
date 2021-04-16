export interface FileStorageInterface {
  name: string
  type: string
  encoding: string
  extension: string
  tmpPath: string
  content: ArrayBuffer
}
