import { closeConnection, repository, startInMemoryDatabase } from '@tests/helpers/orm-connection'

import { TaskStates } from './task.interface'
import { Task } from './task.orm-entity'

beforeEach(async () => startInMemoryDatabase([Task]))
beforeEach(async () => {
  // Const userRepo = repository(User)
  // mockUser = await userRepo.save({ firstName: 'John', keyResultComments: [] })
  // mockSecondUser = await userRepo.save({ firstName: 'Karl', keyResultComments: [] })
  // const keyResultRepo = repository(KeyResult)
  // mockKeyResult = await keyResultRepo.save({ title: 'finish writing a book' })
})
afterEach(closeConnection)

const taskGenerator = (customFields) => ({
  description: 'do homework',
  state: TaskStates.UNCHECKED,
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
