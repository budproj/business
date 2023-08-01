export type Conditions = [string, Record<string, unknown>]

export class ConditionBuilder {
  private readonly conditions: string[] = []

  private readonly params = {}

  constructor(private readonly scope: string) {}

  key(param: string): string {
    return `${this.scope}_${param.replace(/\W/g, '_')}`
  }

  add(condition: string, params: Record<string, unknown>): ConditionBuilder {
    this.conditions.push(condition)

    Object.assign(this.params, params)

    return this
  }

  gt<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_gt`)
      this.add(`${column} > :${key}`, { [key]: value })
    }

    return this
  }

  gteq<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_gteq`)
      this.add(`${column} >= :${key}`, { [key]: value })
    }

    return this
  }

  lt<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_lt`)
      this.add(`${column} < :${key}`, { [key]: value })
    }

    return this
  }

  lteq<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_lteq`)
      this.add(`${column} <= :${key}`, { [key]: value })
    }

    return this
  }

  eq<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_eq`)
      this.add(`${column} = :${key}`, { [key]: value })
    }

    return this
  }

  notEq<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_not_eq`)
      this.add(`${column} <> :${key}`, { [key]: value })
    }

    return this
  }

  in<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_in`)
      this.add(`${column} = ANY(:${key})`, { [key]: value })
    }

    return this
  }

  notIn<T = unknown>(column: string, value: T): ConditionBuilder {
    if (value !== null && value !== undefined) {
      const key = this.key(`${column}_not_in`)
      this.add(`${column} <> ANY(:${key})`, { [key]: value })
    }

    return this
  }

  isNull<T = unknown>(column: string): ConditionBuilder {
    this.add(`${column} IS NULL`, {})

    return this
  }

  isNotNull<T = unknown>(column: string): ConditionBuilder {
    this.add(`${column} IS NOT NULL`, {})

    return this
  }

  every(): Conditions {
    return this.merge('AND')
  }

  some(): Conditions {
    return this.merge('OR')
  }

  whereEvery(): Conditions {
    const [sql, params] = this.every()
    const statement = sql && `WHERE ${sql}`
    return [statement, params]
  }

  whereSome(): Conditions {
    const [sql, params] = this.some()
    const statement = sql && `WHERE ${sql}`
    return [statement, params]
  }

  private merge(operator: string): Conditions {
    if (this.conditions.length === 0) {
      return ['', {}]
    }

    const sql = this.conditions.map((condition) => `(${condition})`).join(` ${operator} `)
    return [sql, this.params]
  }
}
