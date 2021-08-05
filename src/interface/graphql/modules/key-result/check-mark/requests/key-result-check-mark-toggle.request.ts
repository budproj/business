import { ArgsType, Field } from '@nestjs/graphql';
import { KeyResultCheckMarkInputObject, KeyResultCheckMarkToggleObject } from '../objects/key-result-check-mark-input.objects';


@ArgsType()
export class KeyResultCheckMarkToggleRequest {
  @Field(() => KeyResultCheckMarkToggleObject)
  public readonly data: KeyResultCheckMarkToggleObject;
}
