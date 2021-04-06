import { IsACompanySpecification } from './specifications/is-a-company.specification'

export class TeamSpecification {
  public readonly isACompany = new IsACompanySpecification()
}
