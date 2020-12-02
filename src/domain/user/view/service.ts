import { Injectable } from '@nestjs/common'

import KeyResultViewService from './key-result/service'

@Injectable()
class UserViewService {
  constructor(public readonly keyResult: KeyResultViewService) {}
}

export default UserViewService
