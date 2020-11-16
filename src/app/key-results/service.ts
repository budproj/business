import { Injectable } from '@nestjs/common'

@Injectable()
class KeyResultsService {
  getKeyResults(): string {
    return 'KeyResults World!'
  }
}

export default KeyResultsService
