import { CycleDTO } from 'domain/cycle/dto'

export class ObjectiveDTO {
  id: number
  title: string
  createdAt: Date
  updatedAt: Date
  cycleId: CycleDTO['id']
}
