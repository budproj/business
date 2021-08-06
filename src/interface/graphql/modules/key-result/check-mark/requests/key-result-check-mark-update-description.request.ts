import { ArgsType, Field, ID } from '@nestjs/graphql';
import { KeyResultCheckMarkUpdateDescriptionInputObject } from '../objects/key-result-check-mark-input.objects';


@ArgsType()
export class KeyResultCheckMarkUpdateDescriptionRequest {
  @Field(() => ID)
  id: string;

  @Field(() => KeyResultCheckMarkUpdateDescriptionInputObject)
  public readonly data: KeyResultCheckMarkUpdateDescriptionInputObject;
}
