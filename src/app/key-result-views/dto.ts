import { IsEnum, IsOptional } from 'class-validator'

import { KeyResultViewBinding } from 'domain/objective-aggregate/key-result-view/dto'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'

export class PostKeyResultViewDTO {
  @IsOptional()
  readonly title: KeyResultView['title']

  @IsOptional()
  @IsEnum(KeyResultViewBinding)
  readonly binding: KeyResultViewBinding

  @IsOptional()
  readonly rank: KeyResultView['rank']
}
