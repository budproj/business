import { createWriteStream, unlink, readFileSync } from 'fs'

import { ReadStream } from 'fs-capacitor'
import { FileUpload } from 'graphql-upload'
import { v4 as uuidv4 } from 'uuid'

import { FileStorageInterface } from '@adapters/storage/interfaces/file.interface'
import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'
import { StorageAdapterProvider } from '@adapters/storage/storage.provider'

import { FilePolicyGraphQLInterface } from './interfaces/file-policy.interface'

export class UploadGraphQLProvider {
  private readonly storage: StorageAdapterProvider

  private get temporaryDir() {
    return '/tmp'
  }

  constructor(repository: RepositoryStorageInterface) {
    this.storage = new StorageAdapterProvider(repository)
  }

  public async uploadFileToRepository(
    file: FileUpload,
    policy?: FilePolicyGraphQLInterface,
  ): Promise<void> {
    const parsedFile = await this.parseGraphQLUpload(file, policy)
    await this.storage.uploadFile(parsedFile)
  }

  protected async parseGraphQLUpload(
    { filename, mimetype, encoding, createReadStream }: FileUpload,
    policy?: FilePolicyGraphQLInterface,
  ): Promise<FileStorageInterface> {
    const readStream = createReadStream()
    const extension = this.getFileExtension(filename)

    const temporaryName = this.createTemporaryFilename()
    const temporaryPath = await this.downloadReadStreamFile(readStream, temporaryName)
    const temporaryFile = readFileSync(temporaryPath)

    return {
      encoding,
      extension,
      policy,
      tmpPath: temporaryPath,
      name: temporaryName,
      type: mimetype,
      content: temporaryFile,
    }
  }

  private async downloadReadStreamFile(readStream: ReadStream, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `${this.temporaryDir}/${filename}`
      const writeStream = createWriteStream(path)

      writeStream.on('finish', () => resolve(path))
      writeStream.on('error', (error) => {
        unlink(path, () => {
          reject(error)
        })
      })

      readStream.pipe(writeStream)
      readStream.on('error', (error) => {
        writeStream.destroy(error)
      })
    })
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').slice(-1)[0]
  }

  private createTemporaryFilename(): string {
    const uuidName: string = uuidv4()
    return uuidName
  }
}
