import { ArgsType, Field } from '@nestjs/graphql';
import { KeyResultCheckMarkDeleteInputObject } from '../objects/key-result-check-mark-input.objects';


@ArgsType()
export class KeyResultCheckMarkDeleteRequest {
  @Field(() => KeyResultCheckMarkDeleteInputObject)
  public readonly data: KeyResultCheckMarkDeleteInputObject;
}
