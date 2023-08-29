import { ActionType, TargetEntity } from 'prisma/generated/llm'

// eslint-disable-next-line unicorn/prevent-abbreviations
interface Args {
  action: ActionType
  entity: TargetEntity
  hashedInput: string
  promptVersion: string
}

function generateId({ action, entity, hashedInput, promptVersion }: Args) {
  return `${action}.${entity}.${hashedInput}@${promptVersion}`
}

export default generateId
