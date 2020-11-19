import { IsEnum, IsOptional } from 'class-validator'

import { KeyResultViewBinding } from 'domain/objective-aggregate/key-result-view/dto'

import { KeyResultScopes } from './types'

export class GetKeyResultsDTO {
  @IsOptional()
  @IsEnum(KeyResultViewBinding)
  readonly view: string

  @IsEnum(KeyResultScopes)
  readonly scope: string
}
