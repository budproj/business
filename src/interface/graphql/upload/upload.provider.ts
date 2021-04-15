import { createWriteStream, unlink, readFileSync } from 'fs'

import { ReadStream } from 'fs-capacitor'
import { FileUpload } from 'graphql-upload'
import { v4 as uuidv4 } from 'uuid'

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
    const readStream = createReadStream()
    const extension = this.getFileExtension(filename)

    const temporaryName = this.createTemporaryFilename(extension)
    const temporaryPath = await this.downloadReadStreamFile(readStream, temporaryName)
    const temporaryFile = readFileSync(temporaryPath)

    return {
      encoding,
      extension,
      tmpPath: temporaryPath,
      name: temporaryName,
      type: mimetype,
      content: temporaryFile,
    }
  }

  private async downloadReadStreamFile(readStream: ReadStream, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `${this.dir}/${filename}`
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

  private createTemporaryFilename(extension: string): string {
    const uuidName: string = uuidv4()
    const filename = `${uuidName}.${extension}`

    return filename
  }
}
