import { mapValues, uniq } from 'lodash'

import { Effect } from './enums/effect.enum'
import { CommandStatement } from './types/command-statement.type'

export class PolicyAdapter {
  public denyCommandStatement(statement: CommandStatement): CommandStatement {
    return mapValues(statement, () => Effect.DENY)
  }

  public commandStatementIsDenyingAll(statement: CommandStatement): boolean {
    const effects = uniq(Object.values(statement))

    return effects === [Effect.DENY]
  }
}
