import { ArgsType, Field } from '@nestjs/graphql'

import { WorkspaceCreateInputObject } from '../objects/workspace-create-input.object'

@ArgsType()
export class WorkspaceCreateRequest {
  @Field(() => WorkspaceCreateInputObject)
  public readonly data: WorkspaceCreateInputObject
}
