import { UserGender } from '@core/modules/user/enums/user-gender.enum'

export type UserProperties = {
  id: string
  firstName: string
  lastName?: string
  gender: UserGender
  createdAt: string
  updatedAt: string
}
