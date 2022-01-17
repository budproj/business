import { User, KeyResult } from './__tests-helpers__/external-entities'
import {
  closeConnection,
  repository,
  startInMemoryDatabase,
  testProvider,
} from './__tests-helpers__/orm-connection'
import { CheckMarkStates } from './key-result-check-mark.interface'
import { KeyResultCheckMark } from './key-result-check-mark.orm-entity'
import { KeyResultCheckMarkProvider } from './key-result-check-mark.provider'
import { KeyResultCheckMarkRepository } from './key-result-check-mark.repository'

let mockUser: User
let mockSecondUser: User
let mockKeyResult: KeyResult
let mockSecondKeyResult: KeyResult

beforeEach(async () => startInMemoryDatabase([User, KeyResult, KeyResultCheckMark]))
beforeEach(async () => {
  const userRepo = repository(User)
  mockUser = await userRepo.save({ firstName: 'John', keyResultComments: [] })
  mockSecondUser = await userRepo.save({ firstName: 'Maria', keyResultComments: [] })

  const keyResultRepo = repository(KeyResult)
  mockKeyResult = await keyResultRepo.save({ title: 'finish writing a book' })
  mockSecondKeyResult = await keyResultRepo.save({ title: 'get a new customer' })
})
afterEach(closeConnection)

const checkMarkGenerator = (customFields) => ({
  state: CheckMarkStates.UNCHECKED,
  description: 'do the dishes',
  keyResultId: mockKeyResult.id,
  userId: mockUser.id,
  ...customFields,
})
const provider = () => testProvider(KeyResultCheckMarkRepository, KeyResultCheckMarkProvider)

describe('check-mark - provider', () => {
  describe('createCheckMark', () => {
    it('should allow an unchecked check mark', async () => {
      // Arrange
      const checkMark = checkMarkGenerator({ state: CheckMarkStates.UNCHECKED })

      // Act
      const result = await provider().createCheckMark(checkMark)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].state).toBe(CheckMarkStates.UNCHECKED)
    })
  })

  describe('checkCheckMark', () => {
    it('should check an unchecked check mark by passing an id', async () => {
      // Arrange
      const checkMarkId = '940ef077-a373-46bc-83f7-4ce93c806eec'
      const baseCheckMark = checkMarkGenerator({ id: checkMarkId })

      // Act
      await provider().createCheckMark(baseCheckMark)
      const before = await provider().getOne({ id: checkMarkId })
      await provider().checkCheckMark(checkMarkId)
      const after = await provider().getOne({ id: checkMarkId })

      // Assert
      expect(before.state).toBe(CheckMarkStates.UNCHECKED)
      expect(after.state).toBe(CheckMarkStates.CHECKED)
    })
  })

  describe('uncheckCheckMark', () => {
    it('should check an unchecked check mark by passing an id', async () => {
      // Arrange
      const checkMarkId = '940ef077-a373-46bc-83f7-4ce93c806eec'
      const baseCheckMark = checkMarkGenerator({ id: checkMarkId, state: CheckMarkStates.CHECKED })

      // Act
      await provider().createCheckMark(baseCheckMark)
      const before = await provider().getOne({ id: checkMarkId })
      await provider().uncheckCheckMark(checkMarkId)
      const after = await provider().getOne({ id: checkMarkId })

      // Assert
      expect(before.state).toBe(CheckMarkStates.CHECKED)
      expect(after.state).toBe(CheckMarkStates.UNCHECKED)
    })
  })

  describe('changeDescription', () => {
    it('should change description from "do the dishes" to "remove the dishes"', async () => {
      // Arrange
      const checkMarkId = '940ef077-a373-46bc-83f7-4ce93c806eec'
      const baseCheckMark = checkMarkGenerator({ id: checkMarkId, description: 'do the dishes' })

      // Act
      await provider().createCheckMark(baseCheckMark)
      const before = await provider().getOne({ id: checkMarkId })
      await provider().changeDescription(checkMarkId, 'remove the dishes')
      const after = await provider().getOne({ id: checkMarkId })

      // Assert
      expect(before.description).toBe('do the dishes')
      expect(after.description).toBe('remove the dishes')
    })
  })

  describe('deleteAllOfKeyResult', () => {
    it('should delete all check marks of one key result', async () => {
      // Arrange
      const checkMark1 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark2 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark3 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark4 = checkMarkGenerator({ keyResultId: mockSecondKeyResult.id })

      // Act
      const [{ id: checkMark1Id }] = await provider().createCheckMark(checkMark1)
      const [{ id: checkMark2Id }] = await provider().createCheckMark(checkMark2)
      const [{ id: checkMark3Id }] = await provider().createCheckMark(checkMark3)
      const [{ id: checkMark4Id }] = await provider().createCheckMark(checkMark4)
      await provider().deleteAllOfKeyResult(mockKeyResult.id)
      const result1 = await provider().getOne({ id: checkMark1Id })
      const result2 = await provider().getOne({ id: checkMark2Id })
      const result3 = await provider().getOne({ id: checkMark3Id })
      const result4 = await provider().getOne({ id: checkMark4Id })

      // Assert
      expect(result1).not.toBeDefined()
      expect(result2).not.toBeDefined()
      expect(result3).not.toBeDefined()
      expect(result4.id).toBe(checkMark4Id)
      expect(result4.keyResultId).toBe(mockSecondKeyResult.id)
    })
  })

  describe('getFromKeyResult', () => {
    it('should return a list of check marks from key result', async () => {
      // Arrange
      const checkMark1 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark2 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark3 = checkMarkGenerator({ keyResultId: mockKeyResult.id })
      const checkMark4 = checkMarkGenerator({ keyResultId: mockSecondKeyResult.id })

      // Act
      const [{ id: checkMark1Id }] = await provider().createCheckMark(checkMark1)
      const [{ id: checkMark2Id }] = await provider().createCheckMark(checkMark2)
      const [{ id: checkMark3Id }] = await provider().createCheckMark(checkMark3)
      const [{ id: checkMark4Id }] = await provider().createCheckMark(checkMark4)
      const result = await provider().getFromKeyResult(mockKeyResult.id)

      // Assert
      const ids = result.map((item) => item.id)
      expect(ids).toHaveLength(3)
      expect(ids).toStrictEqual([checkMark1Id, checkMark2Id, checkMark3Id])
      expect(ids.find((id) => id === checkMark4Id)).toBeUndefined()
    })
  })

  describe('getFromIndexes', () => {
    it('should return an item from database', async () => {
      // Arrange
      const indexes = { state: CheckMarkStates.UNCHECKED, userId: mockUser.id }
      const checkMark = checkMarkGenerator(indexes)

      // Act
      await provider().createCheckMark(checkMark)
      const result = await provider().getFromIndexes(indexes)

      // Act
      expect(result.state).toBe(CheckMarkStates.UNCHECKED)
      expect(result.userId).toBe(mockUser.id)
    })
  })

  describe('changeAssigned', () => {
    it('should change assigned to another user', async () => {
      // Arrange
      const checkMarkId = '940ef077-a373-46bc-83f7-4ce93c806edc'
      const baseCheckMark = checkMarkGenerator({ id: checkMarkId, assignedUserId: mockUser.id })

      // Act
      await provider().createCheckMark(baseCheckMark)
      const before = await provider().getOne({ id: checkMarkId })
      await provider().changeAssigned(checkMarkId, mockSecondUser.id)
      const after = await provider().getOne({ id: checkMarkId })

      // Assert
      expect(before.assignedUserId).toBe(mockUser.id)
      expect(after.assignedUserId).toBe(mockSecondUser.id)
    })

    it('should allow remove assigned', async () => {
      // Arrange
      const checkMarkId = '940ef077-a373-46bc-83f7-4ce93c806edc'
      const baseCheckMark = checkMarkGenerator({ id: checkMarkId, assignedUserId: mockUser.id })

      // Act
      await provider().createCheckMark(baseCheckMark)
      const before = await provider().getOne({ id: checkMarkId })
      await provider().changeAssigned(checkMarkId)
      const after = await provider().getOne({ id: checkMarkId })

      // Assert
      expect(before.assignedUserId).toBe(mockUser.id)
      expect(after.assignedUserId).toBeNull()
    })
  })
})
