export enum CONSTRAINT {
  ANY = 'any',
  COMPANY = 'company',
  TEAM = 'team',
  OWNS = 'owns',
}

export const CONSTRAINT_ORDER = [
  CONSTRAINT.ANY,
  CONSTRAINT.COMPANY,
  CONSTRAINT.TEAM,
  CONSTRAINT.OWNS,
]

export enum TIMEFRAME_SCOPE {
  CURRENT = 'CURRENT',
  SNAPSHOT = 'SNAPSHOT',
}

export enum DOMAIN_SORTING {
  DESC = 'DESC',
  ASC = 'ASC',
}

export const LODASH_SORTING: Record<DOMAIN_SORTING, 'asc' | 'desc'> = {
  [DOMAIN_SORTING.DESC]: 'desc',
  [DOMAIN_SORTING.ASC]: 'asc',
}

export enum MUTATION_QUERY_TYPE {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
