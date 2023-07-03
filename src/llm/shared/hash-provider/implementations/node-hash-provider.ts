import { Injectable } from '@nestjs/common'
import * as objectHash from 'object-hash'

import { HashProvider } from '../models/hash-provider'

@Injectable()
class NodeHashProvider implements HashProvider {
  async generateHash(input: any): Promise<string> {
    return objectHash(input, {
      algorithm: 'sha1',
      encoding: 'hex',
      replacer: (value) => {
        // Improve idempotency by ignoring milliseconds in dates
        if (value instanceof Date) {
          return Math.floor(value.getTime() / 1000)
        }

        return value
      }
      // TODO: maybe we should also add `unorderedArrays: true`?
    })
  }
}

export default NodeHashProvider
