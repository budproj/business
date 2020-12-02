import { Injectable } from '@nestjs/common'

import DomainKeyResultViewService from './key-result/service'

@Injectable()
class DomainUserViewService {
  constructor(public readonly keyResult: DomainKeyResultViewService) {}
}

export default DomainUserViewService
