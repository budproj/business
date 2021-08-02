// Inspired by this example: https://gist.github.com/Ciantic/be6a8b8ca27ee15e2223f642b5e01549

import { CheckMarkStates } from './check-mark.interface'
import { CheckMark } from './check-mark.orm-entity'
import { User, KeyResult } from './__tests-helpers__/external-entities'
import { startInMemoryDb, closeConnection, repository } from './__tests-helpers__/orm-connection'

let mockUser: User
let mockKeyResult: KeyResult

beforeEach(() => startInMemoryDb([User, KeyResult, CheckMark]))
beforeEach(async () => {
  const userRepo = repository(User)
  mockUser = await userRepo.save({ firstName: 'John', keyResultComments: [] })

  const keyResultRepo = repository(KeyResult)
  mockKeyResult = await keyResultRepo.save({ title: 'finish writing a book' })
})
afterEach(closeConnection)

describe('check-mark - entity', () => {
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
    await repository(CheckMark).save(checkMark)
    const result = await repository(CheckMark).findOne()

    // Assert
    expect(result.state).toBe(CheckMarkStates.UNCHECKED)
  })

  it('should allow a checked check mark', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ state: CheckMarkStates.CHECKED })

    // Act
    await repository(CheckMark).save(checkMark)
    const result = await repository(CheckMark).findOne()

    // Assert
    expect(result.state).toBe(CheckMarkStates.CHECKED)
  })

  it('should not allow other states', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ state: 'something' }) as CheckMark

    // Act
    const action = async () => repository(CheckMark).save(checkMark)

    // Assert
    expect(action).rejects.toThrow()
  })

  it('should contain an User', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ userId: mockUser.id })

    // Act
    await repository(CheckMark).save(checkMark)
    const result = await repository(CheckMark).findOne({ relations: ['user'] })

    // Assert
    expect(result.user.firstName).toBe(mockUser.firstName)
  })

  it('should contain an KeyResult', async () => {
    // Arrange
    const checkMark = checkMarkGenerator({ keyResultId: mockKeyResult.id })

    // Act
    await repository(CheckMark).save(checkMark)
    const result = await repository(CheckMark).findOne({ relations: ['keyResult'] })

    // Assert
    expect(result.keyResult.title).toBe(mockKeyResult.title)
  })

  describe('modification tests', () => {
    it('should be able to change description', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ description: 'do homework' })

      // Act
      await repository(CheckMark).save(checkMark)
      const firstTimeSavedCheckMark = await repository(CheckMark).findOne()

      await repository(CheckMark).update(firstTimeSavedCheckMark.id, { description: 'write a report' })
      const secondTimeSavedCheckMark = await repository(CheckMark).findOne()

      // Assert
      expect(firstTimeSavedCheckMark.description).toBe('do homework')
      expect(secondTimeSavedCheckMark.description).toBe('write a report')
    })

    it('todo should be able to mark as checked', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ state: CheckMarkStates.UNCHECKED })

      // Act
      await repository(CheckMark).save(checkMark)
      const firstTimeSavedCheckMark = await repository(CheckMark).findOne()

      await repository(CheckMark).update(firstTimeSavedCheckMark.id, { state: CheckMarkStates.CHECKED })
      const secondTimeSavedCheckMark = await repository(CheckMark).findOne()

      // Assert
      expect(firstTimeSavedCheckMark.state).toBe(CheckMarkStates.UNCHECKED)
      expect(secondTimeSavedCheckMark.state).toBe(CheckMarkStates.CHECKED)
    })

    it('should be able to uncheck a checked field', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ state: CheckMarkStates.CHECKED })

      // Act
      await repository(CheckMark).save(checkMark)
      const firstTimeSavedCheckMark = await repository(CheckMark).findOne()

      await repository(CheckMark).update(firstTimeSavedCheckMark.id, {
        state: CheckMarkStates.UNCHECKED,
      })
      const secondTimeSavedCheckMark = await repository(CheckMark).findOne()

      // Assert
      expect(firstTimeSavedCheckMark.state).toBe(CheckMarkStates.CHECKED)
      expect(secondTimeSavedCheckMark.state).toBe(CheckMarkStates.UNCHECKED)
    })
  })
})
