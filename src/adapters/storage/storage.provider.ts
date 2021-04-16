import { FileStorageInterface } from './interfaces/file.interface'
import { RemoteFileStorageInterface } from './interfaces/remote-file.interface'
import { RepositoryStorageInterface } from './interfaces/repository.interface'

export class StorageAdapterProvider {
  constructor(private readonly repository: RepositoryStorageInterface) {}

  public async uploadFile(file: FileStorageInterface): Promise<RemoteFileStorageInterface> {
    const uploadedFile = this.repository.upload(file)

    return uploadedFile
  }
}
