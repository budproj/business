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

export enum DOMAIN_QUERY_ORDER {
  DESC = 'DESC',
  ASC = 'ASC',
}
