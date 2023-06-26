import { Module } from '@nestjs/common'

import NodeHashProvider from './implementations/node-hash-provider'
import { HashProvider } from './models/hash-provider'

@Module({
  providers: [
    NodeHashProvider,
    {
      provide: HashProvider,
      useClass: NodeHashProvider,
    },
  ],
  exports: [HashProvider],
})
export class HashModule {}
