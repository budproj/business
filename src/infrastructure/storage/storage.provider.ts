import { Injectable } from '@nestjs/common'

@Injectable()
export class StorageProvider {
  public async uploadFile(file: any): Promise<string> {
    return 'ok'
  }
}
