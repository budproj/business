import { FileStorageInterface } from './file.interface'
import { RemoteFileStorageInterface } from './remote-file.interface'

export interface RepositoryStorageInterface {
  upload: (file: FileStorageInterface) => Promise<RemoteFileStorageInterface>
}
