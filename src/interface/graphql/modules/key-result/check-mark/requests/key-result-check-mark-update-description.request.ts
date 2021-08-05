import { ArgsType, Field } from '@nestjs/graphql';
import { KeyResultCheckMarkUpdateDescriptionInputObject } from '../objects/key-result-check-mark-input.objects';


@ArgsType()
export class KeyResultCheckMarkUpdateDescriptionRequest {
  @Field(() => KeyResultCheckMarkUpdateDescriptionInputObject)
  public readonly data: KeyResultCheckMarkUpdateDescriptionInputObject;
}
