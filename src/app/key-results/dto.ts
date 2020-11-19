import { IsEnum, IsOptional } from 'class-validator'

import { IKeyResultViewBinding } from 'domain/objective-aggregate/key-result-view/dto'

import { KeyResultScopes } from './types'

export class GetKeyResultsDTO {
  @IsOptional()
  @IsEnum(IKeyResultViewBinding)
  readonly view: string

  @IsEnum(KeyResultScopes)
  readonly scope: string
}
