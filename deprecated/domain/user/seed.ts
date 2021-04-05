import faker from 'faker'

import { optionalValue } from 'lib/jest/faker'

import { USER_GENDER } from './constants'
import { User } from './entities'

const seedUser = () => {
  const firstName = faker.name.firstName()
  const authzSub = faker.random.uuid()

  const lastName = faker.name.lastName()
  const gender = faker.helpers.randomize(Object.values(USER_GENDER))
  const role = faker.company.catchPhraseNoun()
  const picture = faker.internet.avatar()

  const user = new User()
  user.firstName = firstName
  user.authzSub = authzSub
  user.lastName = optionalValue(lastName)
  user.gender = optionalValue(gender)
  user.role = optionalValue(role)
  user.picture = optionalValue(picture)

  return user
}

export default seedUser
