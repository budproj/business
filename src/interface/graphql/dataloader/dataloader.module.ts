import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { DataloaderService } from './dataloader.service'

@Module({
  imports: [CoreModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
