import { Injectable } from '@nestjs/common'
import * as objectHash from 'object-hash'

import { HashProvider } from '../models/hash-provider'

@Injectable()
class NodeHashProvider implements HashProvider {
  async generateHash(input: any): Promise<string> {
    return objectHash.sha1(input)
  }
}

export default NodeHashProvider
