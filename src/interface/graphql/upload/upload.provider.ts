import { createWriteStream, unlink } from 'fs'

import { ReadStream } from 'fs-capacitor'
import { FileUpload } from 'graphql-upload'

import { FileStorageInterface } from '@adapters/storage/interfaces/file.interface'
import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'
import { StorageAdapterProvider } from '@adapters/storage/storage.provider'

export class UploadGraphQLProvider {
  private readonly storage: StorageAdapterProvider

  private get dir() {
    return '/tmp'
  }

  constructor(repository: RepositoryStorageInterface) {
    this.storage = new StorageAdapterProvider(repository)
  }

  public async uploadFileToRepository(file: FileUpload): Promise<void> {
    const parsedFile = await this.parseGraphQLUpload(file)
    console.log(parsedFile)
  }

  protected async parseGraphQLUpload({
    filename,
    mimetype,
    encoding,
    createReadStream,
  }: FileUpload): Promise<FileStorageInterface> {
    console.log(createReadStream)
    const readStream = createReadStream()
    const fileContent = await this.getReadStreamContent(readStream, filename)

    return {
      encoding,
      name: filename,
      extension: this.getFileExtension(filename),
      type: mimetype,
      content: fileContent,
    }
  }

  private async getReadStreamContent(
    readStream: ReadStream,
    filename?: string,
  ): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const path = `${this.dir}/${filename}`
      const writeStream = createWriteStream(path)

      writeStream.on('finish', resolve)
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
}
