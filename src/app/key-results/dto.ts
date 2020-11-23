import { IsEnum, IsOptional } from 'class-validator'

import { KeyResultViewBinding } from 'domain/objective-aggregate/key-result-view/dto'

import { KeyResultScopes } from './types'

export class GetKeyResultsDTO {
  @IsOptional()
  @IsEnum(KeyResultViewBinding)
  readonly viewBinding: KeyResultViewBinding

  @IsEnum(KeyResultScopes)
  readonly scope: string
}
