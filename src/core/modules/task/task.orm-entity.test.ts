import { closeConnection, repository, startInMemoryDatabase } from '@tests/helpers/orm-connection'

import { User } from './__tests-helpers__/external-entities'
import { TaskStates } from './task.interface'
import { Task } from './task.orm-entity'

let mockUser: User

beforeEach(async () => startInMemoryDatabase([Task, User]))
beforeEach(async () => {
  const userRepo = repository(User)

  mockUser = await userRepo.save({ firstName: 'John', keyResultComments: [] })
})
afterEach(closeConnection)

const taskGenerator = (customFields): Task => ({
  description: 'do homework',
  state: TaskStates.UNCHECKED,
  userId: mockUser.id,
  ...customFields,
})

describe('Task - ORM Entity', () => {
  it('should be able to create a task', async () => {
    // Arrange
    const task = taskGenerator({ description: 'do homework' })

    // Act
    await repository(Task).save(task)
    const savedTask = await repository(Task).findOne()

    // Assert
    expect(savedTask.description).toBe('do homework')
  })

  it('should be able to complete a task', async () => {
    // Arrange
    const task = taskGenerator({ description: 'do homework' })
    const checkedTask = taskGenerator({ state: TaskStates.CHECKED })

    // Act
    await repository(Task).save(task)
    const savedTask = await repository(Task).findOne()

    await repository(Task).update(savedTask.id, checkedTask)
    const updatedTask = await repository(Task).findOne()

    // Assert
    expect(updatedTask.state).toBe(TaskStates.CHECKED)
  })
})
