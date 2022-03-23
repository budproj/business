import { FindConditions } from 'typeorm'

import { Team } from '../team.orm-entity'

export type TeamSelector = FindConditions<Team> & { onlyCompanies?: boolean }
