import faker from 'faker'

export const optionalValue = <T = any>(value: T): T | undefined =>
  faker.helpers.randomize([undefined, value])
