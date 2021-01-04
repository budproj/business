import { TeamObject } from './models'

export interface GraphQLTeamsQueryFilters {
  parentTeamId?: TeamObject['parentTeamId']
  onlyCompanies?: boolean
  onlyCompaniesAndDepartments?: boolean
}
