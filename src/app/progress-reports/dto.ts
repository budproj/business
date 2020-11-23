import { IsOptional } from 'class-validator'

import { KeyResultDTO } from 'domain/objective-aggregate/key-result/dto'
import { ProgressReportDTO } from 'domain/objective-aggregate/progress-report/dto'

export class PostProgressReportDTO {
  @IsOptional()
  readonly comment?: ProgressReportDTO['comment']

  readonly value: ProgressReportDTO['valueNew']
  readonly keyResultID: KeyResultDTO['id']
}
