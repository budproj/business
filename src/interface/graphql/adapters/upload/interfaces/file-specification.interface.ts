import { FilePolicyGraphQLInterface } from './file-policy.interface'

export interface FileSpecificationGraphQLInterface {
  path?: string
  policy?: FilePolicyGraphQLInterface
}
