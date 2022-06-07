import { ObjectLiteral } from './common/types/object-literal.type'
import { CoreEntityRepository } from './core.repository'

describe('CoreRepository', () => {
  class DummyService extends CoreEntityRepository<ObjectLiteral> {
    addOwnsWhereExpression(query) {
      return query
    }

    addTeamWhereExpression(query) {
      return query
    }
  }

  const dummyService = new DummyService()

  describe('buildQueryFromFilters', () => {
    it('should build a query with only one entity filter', () => {
      // Arrange
      const filters = {
        cycle: {
          id: '2343197f-6bd7-4336-b276-dd94a4a7951d',
        },
      } as any

      const nullableFilters = {
        keyResultCheckIn: ['createdAt'],
      }

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe('(Cycle.id = :cycle_id )')
    })

    it('should build a query with only two entity filter', () => {
      // Arrange
      const filters = {
        cycle: {
          active: true,
        },
        team: {
          id: '92c82e64-836c-44a5-a8c1-0db63cd340b3',
        },
      } as any

      const nullableFilters = {
        keyResultCheckIn: ['createdAt'],
      }

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe('(Cycle.active = :cycle_active ) AND (Team.id = :team_id )')
    })

    it('should build a query with only three entity filter', () => {
      // Arrange
      const filters = {
        keyResult: {
          createdAt: {},
        },
        cycle: {
          active: true,
        },
        team: {
          id: '92c82e64-836c-44a5-a8c1-0db63cd340b3',
        },
      } as any

      const nullableFilters = {
        keyResultCheckIn: ['createdAt'],
      }

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe(
        '(KeyResult.createdAt < :keyResult_createdAt ) AND (Cycle.active = :cycle_active ) AND (Team.id = :team_id )',
      )
    })

    it('should build a query with one entity and two columns filter', () => {
      // Arrange
      const filters = {
        objective: {
          ownerId: '123',
          teamId: '321',
        },
      } as any

      const nullableFilters = {}

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe(
        '(Objective.ownerId = :objective_ownerId ) AND (Objective.teamId = :objective_teamId )',
      )
    })

    it('should build a query with two entity and two columns filter', () => {
      // Arrange
      const filters = {
        objective: {
          ownerId: '123',
          teamId: '321',
        },
        cycle: {
          active: true,
          teamId: '321',
        },
      } as any

      const nullableFilters = {}

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe(
        '(Objective.ownerId = :objective_ownerId ) AND (Objective.teamId = :objective_teamId ) AND (Cycle.active = :cycle_active ) AND (Cycle.teamId = :cycle_teamId )',
      )
    })

    it('should build a query with three entity and three columns filter', () => {
      // Arrange
      const filters = {
        objective: {
          cycleId: '000',
          teamId: '321',
          ownerId: '123',
        },
        cycle: {
          active: true,
          teamId: '321',
          ownerId: '321',
        },
      } as any

      const nullableFilters = {}

      // Act
      const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

      // Assert
      expect(result).toBe(
        '(Objective.cycleId = :objective_cycleId ) AND (Objective.teamId = :objective_teamId ) AND (Objective.ownerId = :objective_ownerId ) AND (Cycle.active = :cycle_active ) AND (Cycle.teamId = :cycle_teamId ) AND (Cycle.ownerId = :cycle_ownerId )',
      )
    })

    describe('Nullable filters', () => {
      it('should add OR {field} IS NULL if the the filter has any of the nullable fielters', () => {
        // Arrange
        const currentDate = '2022-01-01 12:00:00'
        const filters = {
          keyResultCheckIn: {
            createdAt: currentDate,
          },
        } as any

        const nullableFilters = {
          keyResultCheckIn: ['createdAt'],
        }

        // Act
        const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

        // Assert
        expect(result).toBe(
          '(KeyResultCheckIn.createdAt < :keyResultCheckIn_createdAt OR KeyResultCheckIn.createdAt IS NULL)',
        )
      })

      it('should add {field} IS NULL if the the filter is null', () => {
        // Arrange
        const filters = {
          objective: {
            // eslint-disable-next-line unicorn/no-null
            teamId: null,
          },
        } as any

        const nullableFilters = {}

        // Act
        const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

        // Assert
        expect(result).toBe('(Objective.teamId IS NULL)')
      })

      it('should ignore the nullable filter if the filter query is null', () => {
        // Arrange
        const filters = {
          objective: {
            // eslint-disable-next-line unicorn/no-null
            teamId: null,
          },
        } as any

        const nullableFilters = {
          objective: ['teamId'],
        }

        // Act
        const result = dummyService.buildQueryFromFilters(filters, nullableFilters)

        // Assert
        expect(result).toBe('(Objective.teamId IS NULL)')
      })
    })
  })
})
