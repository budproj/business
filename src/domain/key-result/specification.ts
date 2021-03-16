import { Injectable } from '@nestjs/common'

import IsOutdated from './specifications/is-outdated'

@Injectable()
class DomainKeyResultSpecification {
  constructor(public readonly isOutdated: IsOutdated) {}
}

export default DomainKeyResultSpecification
