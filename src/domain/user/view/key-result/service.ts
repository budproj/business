import { Injectable } from '@nestjs/common'

import DomainEntityService from 'domain/service'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly repository: DomainKeyResultViewRepository) {
    super(repository, DomainKeyResultViewService.name)
  }
}

export default DomainKeyResultViewService
