import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { Activity } from '@adapters/activity/activities/base.activity'
import { GraphQContext } from '@interface/graphql/adapters/context/interfaces/context.interface'

export const RequestActivity = createParamDecorator<Activity>(
  (_, executionContext: ExecutionContext): Activity => {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const context: GraphQContext = graphqlContext.getContext()

    return context.activity
  },
)
