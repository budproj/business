// Inspired by this example: https://gist.github.com/Ciantic/be6a8b8ca27ee15e2223f642b5e01549

import {
  createConnection,
  getConnection,
  getRepository,
  ConnectionOptions,
  Entity,
  Column,
} from 'typeorm'

import { CoreEntity } from '@core/core.orm-entity'

import { CheckMarkStates } from './check-mark.interface'
import { CheckMark } from './check-mark.orm-entity'

@Entity()
class User extends CoreEntity {
  @Column()
  firstName: string

  keyResultComments: string[]
}

@Entity()
class KeyResult extends CoreEntity {
  @Column()
  title: string
}

// Using a sqlite database for testing, so take care with advanced sql features
const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [User, KeyResult, CheckMark],
  synchronize: true,
  logging: false,
}

let mockUser: User
let mockKeyResult: KeyResult

beforeEach(async () => createConnection(connectionOptions))
beforeEach(async () => {
  const userEntity = getRepository(User)
  mockUser = await userEntity.save({ firstName: 'John', keyResultComments: [] })

  const keyResultEntity = getRepository(KeyResult)
  mockKeyResult = await keyResultEntity.save({ title: 'finish writing a book' })
})
afterEach(async () => getConnection().close())

describe('check-mark - entity', () => {
  const checkMarkEntity = () => getRepository(CheckMark)
  const checkMarkGenerator = (customFields) => ({
    state: CheckMarkStates.UNCHECKED,
    description: 'do the dishes',
    keyResultId: mockKeyResult.id,
    userId: mockUser.id,
    ...customFields,
  })

  it('should allow an unchecked check mark', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ state: CheckMarkStates.UNCHECKED })

    // Act
    await checkMarkEntity().save(checkMark)
    const result = await checkMarkEntity().findOne()

    // Assert
    expect(result.state).toBe(CheckMarkStates.UNCHECKED)
  })

  it('should allow a checked check mark', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ state: CheckMarkStates.CHECKED })

    // Act
    await checkMarkEntity().save(checkMark)
    const result = await checkMarkEntity().findOne()

    // Assert
    expect(result.state).toBe(CheckMarkStates.CHECKED)
  })

  it('should not allow other states', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ state: 'something' }) as CheckMark

    // Act
    const action = async () => checkMarkEntity().save(checkMark)

    // Assert
    expect(action).rejects.toThrow()
  })

  it('should contain an User', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ userId: mockUser.id })

    // Act
    await checkMarkEntity().save(checkMark)
    const result = await checkMarkEntity().findOne({ relations: ['user'] })

    // Assert
    expect(result.user.firstName).toBe(mockUser.firstName)
  })

  it('should contain an KeyResult', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ keyResultId: mockKeyResult.id })

    // Act
    await checkMarkEntity().save(checkMark)
    const result = await checkMarkEntity().findOne({ relations: ['keyResult'] })

    // Assert
    expect(result.keyResult.title).toBe(mockKeyResult.title)
  })

  describe('modification tests', () => {
    it('should be able to change description', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ description: 'do homework' })

      // Act
      await checkMarkEntity().save(checkMark)
      const firstTimeSavedCheckMark = await checkMarkEntity().findOne()

      await checkMarkEntity().update(firstTimeSavedCheckMark.id, { description: 'write a report' })
      const secondTimeSavedCheckMark = await checkMarkEntity().findOne()

      // Assert
      expect(firstTimeSavedCheckMark.description).toBe('do homework')
      expect(secondTimeSavedCheckMark.description).toBe('write a report')
    })

    it('todo should be able to mark as checked', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ state: CheckMarkStates.UNCHECKED })

      // Act
      await checkMarkEntity().save(checkMark)
      const firstTimeSavedCheckMark = await checkMarkEntity().findOne()

      await checkMarkEntity().update(firstTimeSavedCheckMark.id, { state: CheckMarkStates.CHECKED })
      const secondTimeSavedCheckMark = await checkMarkEntity().findOne()

      // Assert
      expect(firstTimeSavedCheckMark.state).toBe(CheckMarkStates.UNCHECKED)
      expect(secondTimeSavedCheckMark.state).toBe(CheckMarkStates.CHECKED)
    })

    it('should be able to uncheck a checked field', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ state: CheckMarkStates.CHECKED })

      // Act
      await checkMarkEntity().save(checkMark)
      const firstTimeSavedCheckMark = await checkMarkEntity().findOne()

      await checkMarkEntity().update(firstTimeSavedCheckMark.id, {
        state: CheckMarkStates.UNCHECKED,
      })
      const secondTimeSavedCheckMark = await checkMarkEntity().findOne()

      // Assert
      expect(firstTimeSavedCheckMark.state).toBe(CheckMarkStates.CHECKED)
      expect(secondTimeSavedCheckMark.state).toBe(CheckMarkStates.UNCHECKED)
    })
  })
})
