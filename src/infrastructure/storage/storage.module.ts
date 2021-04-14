import { Module } from '@nestjs/common'

import { StorageProvider } from './storage.provider'

@Module({
  providers: [StorageProvider],
  exports: [StorageProvider],
})
export class StorageModule {}
