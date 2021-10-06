import { ObjectLiteral } from '@core/common/types/object-literal.type'

export interface SerializedException {
  name: string
  message: string
  stack?: string
  metadata?: ObjectLiteral
}
