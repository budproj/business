import { ActionType, TargetEntity } from '@prisma/client'

function genarateId(action: ActionType, entity: TargetEntity, hashedInput: string) {
  return `${action}.${entity}.${hashedInput}`
}

export default genarateId
