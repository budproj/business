import { Team } from './entities'

export type TeamEntityFilter = keyof Team

export type TeamEntityRelation =
  | 'keyResults'
  | 'users'
  | 'owner'
  | 'parentTeam'
  | 'teams'
  | 'cycles'
