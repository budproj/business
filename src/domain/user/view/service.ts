import { forwardRef, Inject, Injectable } from '@nestjs/common'

import DomainKeyResultViewService from './key-result/service'

@Injectable()
class DomainUserViewService {
  constructor(
    @Inject(forwardRef(() => DomainKeyResultViewService))
    public readonly keyResult: DomainKeyResultViewService,
  ) {}
}

export default DomainUserViewService
