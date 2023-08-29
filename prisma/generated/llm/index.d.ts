
/**
 * Client
**/

import * as runtime from './runtime/library';
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends Prisma.PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};

export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>


/**
 * Model OpenAiCompletion
 * 
 */
export type OpenAiCompletion = {
  id: string
  referenceId: string
  createdAt: Date
  requesterUserId: string
  requesterTeamId: string
  requesterCompanyId: string
  action: ActionType
  entity: TargetEntity
  model: string
  messages: Prisma.JsonValue
  input: Prisma.JsonValue
  request: Prisma.JsonValue
  status: OpenAiCompletionStatus
  requestedAt: Date | null
  respondedAt: Date | null
  completionTokens: number | null
  promptTokens: number | null
  totalTokens: number | null
  estimatedCompletionTokens: number | null
  estimatedPromptTokens: number | null
  output: string | null
  response: Prisma.JsonValue | null
}

/**
 * Model UserCompletionFeedback
 * 
 */
export type UserCompletionFeedback = {
  userId: string
  completionId: string
  value: number
  vendor: string
  createdAt: Date
  updatedAt: Date
}


/**
 * Enums
 */

export const ActionType: {
  Summarize: 'Summarize'
};

export type ActionType = (typeof ActionType)[keyof typeof ActionType]


export const OpenAiCompletionStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type OpenAiCompletionStatus = (typeof OpenAiCompletionStatus)[keyof typeof OpenAiCompletionStatus]


export const TargetEntity: {
  KeyResult: 'KeyResult'
};

export type TargetEntity = (typeof TargetEntity)[keyof typeof TargetEntity]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more OpenAiCompletions
 * const openAiCompletions = await prisma.openAiCompletion.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more OpenAiCompletions
   * const openAiCompletions = await prisma.openAiCompletion.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<this, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>

      /**
   * `prisma.openAiCompletion`: Exposes CRUD operations for the **OpenAiCompletion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OpenAiCompletions
    * const openAiCompletions = await prisma.openAiCompletion.findMany()
    * ```
    */
  get openAiCompletion(): Prisma.OpenAiCompletionDelegate<GlobalReject>;

  /**
   * `prisma.userCompletionFeedback`: Exposes CRUD operations for the **UserCompletionFeedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCompletionFeedbacks
    * const userCompletionFeedbacks = await prisma.userCompletionFeedback.findMany()
    * ```
    */
  get userCompletionFeedback(): Prisma.UserCompletionFeedbackDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.15.0
   * Query Engine version: 8fbc245156db7124f997f4cecdd8d1219e360944
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: runtime.Types.Utils.LegacyExact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    OpenAiCompletion: 'OpenAiCompletion',
    UserCompletionFeedback: 'UserCompletionFeedback'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model OpenAiCompletion
   */


  export type AggregateOpenAiCompletion = {
    _count: OpenAiCompletionCountAggregateOutputType | null
    _avg: OpenAiCompletionAvgAggregateOutputType | null
    _sum: OpenAiCompletionSumAggregateOutputType | null
    _min: OpenAiCompletionMinAggregateOutputType | null
    _max: OpenAiCompletionMaxAggregateOutputType | null
  }

  export type OpenAiCompletionAvgAggregateOutputType = {
    completionTokens: number | null
    promptTokens: number | null
    totalTokens: number | null
    estimatedCompletionTokens: number | null
    estimatedPromptTokens: number | null
  }

  export type OpenAiCompletionSumAggregateOutputType = {
    completionTokens: number | null
    promptTokens: number | null
    totalTokens: number | null
    estimatedCompletionTokens: number | null
    estimatedPromptTokens: number | null
  }

  export type OpenAiCompletionMinAggregateOutputType = {
    id: string | null
    referenceId: string | null
    createdAt: Date | null
    requesterUserId: string | null
    requesterTeamId: string | null
    requesterCompanyId: string | null
    action: ActionType | null
    entity: TargetEntity | null
    model: string | null
    status: OpenAiCompletionStatus | null
    requestedAt: Date | null
    respondedAt: Date | null
    completionTokens: number | null
    promptTokens: number | null
    totalTokens: number | null
    estimatedCompletionTokens: number | null
    estimatedPromptTokens: number | null
    output: string | null
  }

  export type OpenAiCompletionMaxAggregateOutputType = {
    id: string | null
    referenceId: string | null
    createdAt: Date | null
    requesterUserId: string | null
    requesterTeamId: string | null
    requesterCompanyId: string | null
    action: ActionType | null
    entity: TargetEntity | null
    model: string | null
    status: OpenAiCompletionStatus | null
    requestedAt: Date | null
    respondedAt: Date | null
    completionTokens: number | null
    promptTokens: number | null
    totalTokens: number | null
    estimatedCompletionTokens: number | null
    estimatedPromptTokens: number | null
    output: string | null
  }

  export type OpenAiCompletionCountAggregateOutputType = {
    id: number
    referenceId: number
    createdAt: number
    requesterUserId: number
    requesterTeamId: number
    requesterCompanyId: number
    action: number
    entity: number
    model: number
    messages: number
    input: number
    request: number
    status: number
    requestedAt: number
    respondedAt: number
    completionTokens: number
    promptTokens: number
    totalTokens: number
    estimatedCompletionTokens: number
    estimatedPromptTokens: number
    output: number
    response: number
    _all: number
  }


  export type OpenAiCompletionAvgAggregateInputType = {
    completionTokens?: true
    promptTokens?: true
    totalTokens?: true
    estimatedCompletionTokens?: true
    estimatedPromptTokens?: true
  }

  export type OpenAiCompletionSumAggregateInputType = {
    completionTokens?: true
    promptTokens?: true
    totalTokens?: true
    estimatedCompletionTokens?: true
    estimatedPromptTokens?: true
  }

  export type OpenAiCompletionMinAggregateInputType = {
    id?: true
    referenceId?: true
    createdAt?: true
    requesterUserId?: true
    requesterTeamId?: true
    requesterCompanyId?: true
    action?: true
    entity?: true
    model?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
    completionTokens?: true
    promptTokens?: true
    totalTokens?: true
    estimatedCompletionTokens?: true
    estimatedPromptTokens?: true
    output?: true
  }

  export type OpenAiCompletionMaxAggregateInputType = {
    id?: true
    referenceId?: true
    createdAt?: true
    requesterUserId?: true
    requesterTeamId?: true
    requesterCompanyId?: true
    action?: true
    entity?: true
    model?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
    completionTokens?: true
    promptTokens?: true
    totalTokens?: true
    estimatedCompletionTokens?: true
    estimatedPromptTokens?: true
    output?: true
  }

  export type OpenAiCompletionCountAggregateInputType = {
    id?: true
    referenceId?: true
    createdAt?: true
    requesterUserId?: true
    requesterTeamId?: true
    requesterCompanyId?: true
    action?: true
    entity?: true
    model?: true
    messages?: true
    input?: true
    request?: true
    status?: true
    requestedAt?: true
    respondedAt?: true
    completionTokens?: true
    promptTokens?: true
    totalTokens?: true
    estimatedCompletionTokens?: true
    estimatedPromptTokens?: true
    output?: true
    response?: true
    _all?: true
  }

  export type OpenAiCompletionAggregateArgs = {
    /**
     * Filter which OpenAiCompletion to aggregate.
     */
    where?: OpenAiCompletionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenAiCompletions to fetch.
     */
    orderBy?: Enumerable<OpenAiCompletionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpenAiCompletionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenAiCompletions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenAiCompletions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OpenAiCompletions
    **/
    _count?: true | OpenAiCompletionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpenAiCompletionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpenAiCompletionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpenAiCompletionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpenAiCompletionMaxAggregateInputType
  }

  export type GetOpenAiCompletionAggregateType<T extends OpenAiCompletionAggregateArgs> = {
        [P in keyof T & keyof AggregateOpenAiCompletion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpenAiCompletion[P]>
      : GetScalarType<T[P], AggregateOpenAiCompletion[P]>
  }




  export type OpenAiCompletionGroupByArgs = {
    where?: OpenAiCompletionWhereInput
    orderBy?: Enumerable<OpenAiCompletionOrderByWithAggregationInput>
    by: OpenAiCompletionScalarFieldEnum[]
    having?: OpenAiCompletionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpenAiCompletionCountAggregateInputType | true
    _avg?: OpenAiCompletionAvgAggregateInputType
    _sum?: OpenAiCompletionSumAggregateInputType
    _min?: OpenAiCompletionMinAggregateInputType
    _max?: OpenAiCompletionMaxAggregateInputType
  }


  export type OpenAiCompletionGroupByOutputType = {
    id: string
    referenceId: string
    createdAt: Date
    requesterUserId: string
    requesterTeamId: string
    requesterCompanyId: string
    action: ActionType
    entity: TargetEntity
    model: string
    messages: JsonValue
    input: JsonValue
    request: JsonValue
    status: OpenAiCompletionStatus
    requestedAt: Date | null
    respondedAt: Date | null
    completionTokens: number | null
    promptTokens: number | null
    totalTokens: number | null
    estimatedCompletionTokens: number | null
    estimatedPromptTokens: number | null
    output: string | null
    response: JsonValue | null
    _count: OpenAiCompletionCountAggregateOutputType | null
    _avg: OpenAiCompletionAvgAggregateOutputType | null
    _sum: OpenAiCompletionSumAggregateOutputType | null
    _min: OpenAiCompletionMinAggregateOutputType | null
    _max: OpenAiCompletionMaxAggregateOutputType | null
  }

  type GetOpenAiCompletionGroupByPayload<T extends OpenAiCompletionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<OpenAiCompletionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpenAiCompletionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpenAiCompletionGroupByOutputType[P]>
            : GetScalarType<T[P], OpenAiCompletionGroupByOutputType[P]>
        }
      >
    >


  export type OpenAiCompletionSelect = {
    id?: boolean
    referenceId?: boolean
    createdAt?: boolean
    requesterUserId?: boolean
    requesterTeamId?: boolean
    requesterCompanyId?: boolean
    action?: boolean
    entity?: boolean
    model?: boolean
    messages?: boolean
    input?: boolean
    request?: boolean
    status?: boolean
    requestedAt?: boolean
    respondedAt?: boolean
    completionTokens?: boolean
    promptTokens?: boolean
    totalTokens?: boolean
    estimatedCompletionTokens?: boolean
    estimatedPromptTokens?: boolean
    output?: boolean
    response?: boolean
  }


  export type OpenAiCompletionGetPayload<S extends boolean | null | undefined | OpenAiCompletionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? OpenAiCompletion :
    S extends undefined ? never :
    S extends { include: any } & (OpenAiCompletionArgs | OpenAiCompletionFindManyArgs)
    ? OpenAiCompletion 
    : S extends { select: any } & (OpenAiCompletionArgs | OpenAiCompletionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof OpenAiCompletion ? OpenAiCompletion[P] : never
  } 
      : OpenAiCompletion


  type OpenAiCompletionCountArgs = 
    Omit<OpenAiCompletionFindManyArgs, 'select' | 'include'> & {
      select?: OpenAiCompletionCountAggregateInputType | true
    }

  export interface OpenAiCompletionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one OpenAiCompletion that matches the filter.
     * @param {OpenAiCompletionFindUniqueArgs} args - Arguments to find a OpenAiCompletion
     * @example
     * // Get one OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends OpenAiCompletionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, OpenAiCompletionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'OpenAiCompletion'> extends True ? Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>> : Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T> | null, null>

    /**
     * Find one OpenAiCompletion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {OpenAiCompletionFindUniqueOrThrowArgs} args - Arguments to find a OpenAiCompletion
     * @example
     * // Get one OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends OpenAiCompletionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, OpenAiCompletionFindUniqueOrThrowArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Find the first OpenAiCompletion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionFindFirstArgs} args - Arguments to find a OpenAiCompletion
     * @example
     * // Get one OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends OpenAiCompletionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, OpenAiCompletionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'OpenAiCompletion'> extends True ? Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>> : Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T> | null, null>

    /**
     * Find the first OpenAiCompletion that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionFindFirstOrThrowArgs} args - Arguments to find a OpenAiCompletion
     * @example
     * // Get one OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends OpenAiCompletionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OpenAiCompletionFindFirstOrThrowArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Find zero or more OpenAiCompletions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OpenAiCompletions
     * const openAiCompletions = await prisma.openAiCompletion.findMany()
     * 
     * // Get first 10 OpenAiCompletions
     * const openAiCompletions = await prisma.openAiCompletion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const openAiCompletionWithIdOnly = await prisma.openAiCompletion.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends OpenAiCompletionFindManyArgs>(
      args?: SelectSubset<T, OpenAiCompletionFindManyArgs>
    ): Prisma.PrismaPromise<Array<OpenAiCompletionGetPayload<T>>>

    /**
     * Create a OpenAiCompletion.
     * @param {OpenAiCompletionCreateArgs} args - Arguments to create a OpenAiCompletion.
     * @example
     * // Create one OpenAiCompletion
     * const OpenAiCompletion = await prisma.openAiCompletion.create({
     *   data: {
     *     // ... data to create a OpenAiCompletion
     *   }
     * })
     * 
    **/
    create<T extends OpenAiCompletionCreateArgs>(
      args: SelectSubset<T, OpenAiCompletionCreateArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Create many OpenAiCompletions.
     *     @param {OpenAiCompletionCreateManyArgs} args - Arguments to create many OpenAiCompletions.
     *     @example
     *     // Create many OpenAiCompletions
     *     const openAiCompletion = await prisma.openAiCompletion.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends OpenAiCompletionCreateManyArgs>(
      args?: SelectSubset<T, OpenAiCompletionCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OpenAiCompletion.
     * @param {OpenAiCompletionDeleteArgs} args - Arguments to delete one OpenAiCompletion.
     * @example
     * // Delete one OpenAiCompletion
     * const OpenAiCompletion = await prisma.openAiCompletion.delete({
     *   where: {
     *     // ... filter to delete one OpenAiCompletion
     *   }
     * })
     * 
    **/
    delete<T extends OpenAiCompletionDeleteArgs>(
      args: SelectSubset<T, OpenAiCompletionDeleteArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Update one OpenAiCompletion.
     * @param {OpenAiCompletionUpdateArgs} args - Arguments to update one OpenAiCompletion.
     * @example
     * // Update one OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends OpenAiCompletionUpdateArgs>(
      args: SelectSubset<T, OpenAiCompletionUpdateArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Delete zero or more OpenAiCompletions.
     * @param {OpenAiCompletionDeleteManyArgs} args - Arguments to filter OpenAiCompletions to delete.
     * @example
     * // Delete a few OpenAiCompletions
     * const { count } = await prisma.openAiCompletion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends OpenAiCompletionDeleteManyArgs>(
      args?: SelectSubset<T, OpenAiCompletionDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpenAiCompletions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OpenAiCompletions
     * const openAiCompletion = await prisma.openAiCompletion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends OpenAiCompletionUpdateManyArgs>(
      args: SelectSubset<T, OpenAiCompletionUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OpenAiCompletion.
     * @param {OpenAiCompletionUpsertArgs} args - Arguments to update or create a OpenAiCompletion.
     * @example
     * // Update or create a OpenAiCompletion
     * const openAiCompletion = await prisma.openAiCompletion.upsert({
     *   create: {
     *     // ... data to create a OpenAiCompletion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OpenAiCompletion we want to update
     *   }
     * })
    **/
    upsert<T extends OpenAiCompletionUpsertArgs>(
      args: SelectSubset<T, OpenAiCompletionUpsertArgs>
    ): Prisma__OpenAiCompletionClient<OpenAiCompletionGetPayload<T>>

    /**
     * Count the number of OpenAiCompletions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionCountArgs} args - Arguments to filter OpenAiCompletions to count.
     * @example
     * // Count the number of OpenAiCompletions
     * const count = await prisma.openAiCompletion.count({
     *   where: {
     *     // ... the filter for the OpenAiCompletions we want to count
     *   }
     * })
    **/
    count<T extends OpenAiCompletionCountArgs>(
      args?: Subset<T, OpenAiCompletionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpenAiCompletionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OpenAiCompletion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OpenAiCompletionAggregateArgs>(args: Subset<T, OpenAiCompletionAggregateArgs>): Prisma.PrismaPromise<GetOpenAiCompletionAggregateType<T>>

    /**
     * Group by OpenAiCompletion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenAiCompletionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OpenAiCompletionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpenAiCompletionGroupByArgs['orderBy'] }
        : { orderBy?: OpenAiCompletionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OpenAiCompletionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpenAiCompletionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for OpenAiCompletion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__OpenAiCompletionClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * OpenAiCompletion base type for findUnique actions
   */
  export type OpenAiCompletionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter, which OpenAiCompletion to fetch.
     */
    where: OpenAiCompletionWhereUniqueInput
  }

  /**
   * OpenAiCompletion findUnique
   */
  export interface OpenAiCompletionFindUniqueArgs extends OpenAiCompletionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * OpenAiCompletion findUniqueOrThrow
   */
  export type OpenAiCompletionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter, which OpenAiCompletion to fetch.
     */
    where: OpenAiCompletionWhereUniqueInput
  }


  /**
   * OpenAiCompletion base type for findFirst actions
   */
  export type OpenAiCompletionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter, which OpenAiCompletion to fetch.
     */
    where?: OpenAiCompletionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenAiCompletions to fetch.
     */
    orderBy?: Enumerable<OpenAiCompletionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenAiCompletions.
     */
    cursor?: OpenAiCompletionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenAiCompletions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenAiCompletions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenAiCompletions.
     */
    distinct?: Enumerable<OpenAiCompletionScalarFieldEnum>
  }

  /**
   * OpenAiCompletion findFirst
   */
  export interface OpenAiCompletionFindFirstArgs extends OpenAiCompletionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * OpenAiCompletion findFirstOrThrow
   */
  export type OpenAiCompletionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter, which OpenAiCompletion to fetch.
     */
    where?: OpenAiCompletionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenAiCompletions to fetch.
     */
    orderBy?: Enumerable<OpenAiCompletionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenAiCompletions.
     */
    cursor?: OpenAiCompletionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenAiCompletions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenAiCompletions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenAiCompletions.
     */
    distinct?: Enumerable<OpenAiCompletionScalarFieldEnum>
  }


  /**
   * OpenAiCompletion findMany
   */
  export type OpenAiCompletionFindManyArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter, which OpenAiCompletions to fetch.
     */
    where?: OpenAiCompletionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenAiCompletions to fetch.
     */
    orderBy?: Enumerable<OpenAiCompletionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OpenAiCompletions.
     */
    cursor?: OpenAiCompletionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenAiCompletions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenAiCompletions.
     */
    skip?: number
    distinct?: Enumerable<OpenAiCompletionScalarFieldEnum>
  }


  /**
   * OpenAiCompletion create
   */
  export type OpenAiCompletionCreateArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * The data needed to create a OpenAiCompletion.
     */
    data: XOR<OpenAiCompletionCreateInput, OpenAiCompletionUncheckedCreateInput>
  }


  /**
   * OpenAiCompletion createMany
   */
  export type OpenAiCompletionCreateManyArgs = {
    /**
     * The data used to create many OpenAiCompletions.
     */
    data: Enumerable<OpenAiCompletionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * OpenAiCompletion update
   */
  export type OpenAiCompletionUpdateArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * The data needed to update a OpenAiCompletion.
     */
    data: XOR<OpenAiCompletionUpdateInput, OpenAiCompletionUncheckedUpdateInput>
    /**
     * Choose, which OpenAiCompletion to update.
     */
    where: OpenAiCompletionWhereUniqueInput
  }


  /**
   * OpenAiCompletion updateMany
   */
  export type OpenAiCompletionUpdateManyArgs = {
    /**
     * The data used to update OpenAiCompletions.
     */
    data: XOR<OpenAiCompletionUpdateManyMutationInput, OpenAiCompletionUncheckedUpdateManyInput>
    /**
     * Filter which OpenAiCompletions to update
     */
    where?: OpenAiCompletionWhereInput
  }


  /**
   * OpenAiCompletion upsert
   */
  export type OpenAiCompletionUpsertArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * The filter to search for the OpenAiCompletion to update in case it exists.
     */
    where: OpenAiCompletionWhereUniqueInput
    /**
     * In case the OpenAiCompletion found by the `where` argument doesn't exist, create a new OpenAiCompletion with this data.
     */
    create: XOR<OpenAiCompletionCreateInput, OpenAiCompletionUncheckedCreateInput>
    /**
     * In case the OpenAiCompletion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpenAiCompletionUpdateInput, OpenAiCompletionUncheckedUpdateInput>
  }


  /**
   * OpenAiCompletion delete
   */
  export type OpenAiCompletionDeleteArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
    /**
     * Filter which OpenAiCompletion to delete.
     */
    where: OpenAiCompletionWhereUniqueInput
  }


  /**
   * OpenAiCompletion deleteMany
   */
  export type OpenAiCompletionDeleteManyArgs = {
    /**
     * Filter which OpenAiCompletions to delete
     */
    where?: OpenAiCompletionWhereInput
  }


  /**
   * OpenAiCompletion without action
   */
  export type OpenAiCompletionArgs = {
    /**
     * Select specific fields to fetch from the OpenAiCompletion
     */
    select?: OpenAiCompletionSelect | null
  }



  /**
   * Model UserCompletionFeedback
   */


  export type AggregateUserCompletionFeedback = {
    _count: UserCompletionFeedbackCountAggregateOutputType | null
    _avg: UserCompletionFeedbackAvgAggregateOutputType | null
    _sum: UserCompletionFeedbackSumAggregateOutputType | null
    _min: UserCompletionFeedbackMinAggregateOutputType | null
    _max: UserCompletionFeedbackMaxAggregateOutputType | null
  }

  export type UserCompletionFeedbackAvgAggregateOutputType = {
    value: number | null
  }

  export type UserCompletionFeedbackSumAggregateOutputType = {
    value: number | null
  }

  export type UserCompletionFeedbackMinAggregateOutputType = {
    userId: string | null
    completionId: string | null
    value: number | null
    vendor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCompletionFeedbackMaxAggregateOutputType = {
    userId: string | null
    completionId: string | null
    value: number | null
    vendor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCompletionFeedbackCountAggregateOutputType = {
    userId: number
    completionId: number
    value: number
    vendor: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserCompletionFeedbackAvgAggregateInputType = {
    value?: true
  }

  export type UserCompletionFeedbackSumAggregateInputType = {
    value?: true
  }

  export type UserCompletionFeedbackMinAggregateInputType = {
    userId?: true
    completionId?: true
    value?: true
    vendor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCompletionFeedbackMaxAggregateInputType = {
    userId?: true
    completionId?: true
    value?: true
    vendor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCompletionFeedbackCountAggregateInputType = {
    userId?: true
    completionId?: true
    value?: true
    vendor?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserCompletionFeedbackAggregateArgs = {
    /**
     * Filter which UserCompletionFeedback to aggregate.
     */
    where?: UserCompletionFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCompletionFeedbacks to fetch.
     */
    orderBy?: Enumerable<UserCompletionFeedbackOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCompletionFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCompletionFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCompletionFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCompletionFeedbacks
    **/
    _count?: true | UserCompletionFeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserCompletionFeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserCompletionFeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCompletionFeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCompletionFeedbackMaxAggregateInputType
  }

  export type GetUserCompletionFeedbackAggregateType<T extends UserCompletionFeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCompletionFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCompletionFeedback[P]>
      : GetScalarType<T[P], AggregateUserCompletionFeedback[P]>
  }




  export type UserCompletionFeedbackGroupByArgs = {
    where?: UserCompletionFeedbackWhereInput
    orderBy?: Enumerable<UserCompletionFeedbackOrderByWithAggregationInput>
    by: UserCompletionFeedbackScalarFieldEnum[]
    having?: UserCompletionFeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCompletionFeedbackCountAggregateInputType | true
    _avg?: UserCompletionFeedbackAvgAggregateInputType
    _sum?: UserCompletionFeedbackSumAggregateInputType
    _min?: UserCompletionFeedbackMinAggregateInputType
    _max?: UserCompletionFeedbackMaxAggregateInputType
  }


  export type UserCompletionFeedbackGroupByOutputType = {
    userId: string
    completionId: string
    value: number
    vendor: string
    createdAt: Date
    updatedAt: Date
    _count: UserCompletionFeedbackCountAggregateOutputType | null
    _avg: UserCompletionFeedbackAvgAggregateOutputType | null
    _sum: UserCompletionFeedbackSumAggregateOutputType | null
    _min: UserCompletionFeedbackMinAggregateOutputType | null
    _max: UserCompletionFeedbackMaxAggregateOutputType | null
  }

  type GetUserCompletionFeedbackGroupByPayload<T extends UserCompletionFeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UserCompletionFeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCompletionFeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCompletionFeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], UserCompletionFeedbackGroupByOutputType[P]>
        }
      >
    >


  export type UserCompletionFeedbackSelect = {
    userId?: boolean
    completionId?: boolean
    value?: boolean
    vendor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type UserCompletionFeedbackGetPayload<S extends boolean | null | undefined | UserCompletionFeedbackArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? UserCompletionFeedback :
    S extends undefined ? never :
    S extends { include: any } & (UserCompletionFeedbackArgs | UserCompletionFeedbackFindManyArgs)
    ? UserCompletionFeedback 
    : S extends { select: any } & (UserCompletionFeedbackArgs | UserCompletionFeedbackFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof UserCompletionFeedback ? UserCompletionFeedback[P] : never
  } 
      : UserCompletionFeedback


  type UserCompletionFeedbackCountArgs = 
    Omit<UserCompletionFeedbackFindManyArgs, 'select' | 'include'> & {
      select?: UserCompletionFeedbackCountAggregateInputType | true
    }

  export interface UserCompletionFeedbackDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one UserCompletionFeedback that matches the filter.
     * @param {UserCompletionFeedbackFindUniqueArgs} args - Arguments to find a UserCompletionFeedback
     * @example
     * // Get one UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserCompletionFeedbackFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, UserCompletionFeedbackFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'UserCompletionFeedback'> extends True ? Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>> : Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T> | null, null>

    /**
     * Find one UserCompletionFeedback that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserCompletionFeedbackFindUniqueOrThrowArgs} args - Arguments to find a UserCompletionFeedback
     * @example
     * // Get one UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserCompletionFeedbackFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, UserCompletionFeedbackFindUniqueOrThrowArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Find the first UserCompletionFeedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackFindFirstArgs} args - Arguments to find a UserCompletionFeedback
     * @example
     * // Get one UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserCompletionFeedbackFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, UserCompletionFeedbackFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'UserCompletionFeedback'> extends True ? Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>> : Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T> | null, null>

    /**
     * Find the first UserCompletionFeedback that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackFindFirstOrThrowArgs} args - Arguments to find a UserCompletionFeedback
     * @example
     * // Get one UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserCompletionFeedbackFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserCompletionFeedbackFindFirstOrThrowArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Find zero or more UserCompletionFeedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCompletionFeedbacks
     * const userCompletionFeedbacks = await prisma.userCompletionFeedback.findMany()
     * 
     * // Get first 10 UserCompletionFeedbacks
     * const userCompletionFeedbacks = await prisma.userCompletionFeedback.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userCompletionFeedbackWithUserIdOnly = await prisma.userCompletionFeedback.findMany({ select: { userId: true } })
     * 
    **/
    findMany<T extends UserCompletionFeedbackFindManyArgs>(
      args?: SelectSubset<T, UserCompletionFeedbackFindManyArgs>
    ): Prisma.PrismaPromise<Array<UserCompletionFeedbackGetPayload<T>>>

    /**
     * Create a UserCompletionFeedback.
     * @param {UserCompletionFeedbackCreateArgs} args - Arguments to create a UserCompletionFeedback.
     * @example
     * // Create one UserCompletionFeedback
     * const UserCompletionFeedback = await prisma.userCompletionFeedback.create({
     *   data: {
     *     // ... data to create a UserCompletionFeedback
     *   }
     * })
     * 
    **/
    create<T extends UserCompletionFeedbackCreateArgs>(
      args: SelectSubset<T, UserCompletionFeedbackCreateArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Create many UserCompletionFeedbacks.
     *     @param {UserCompletionFeedbackCreateManyArgs} args - Arguments to create many UserCompletionFeedbacks.
     *     @example
     *     // Create many UserCompletionFeedbacks
     *     const userCompletionFeedback = await prisma.userCompletionFeedback.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCompletionFeedbackCreateManyArgs>(
      args?: SelectSubset<T, UserCompletionFeedbackCreateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserCompletionFeedback.
     * @param {UserCompletionFeedbackDeleteArgs} args - Arguments to delete one UserCompletionFeedback.
     * @example
     * // Delete one UserCompletionFeedback
     * const UserCompletionFeedback = await prisma.userCompletionFeedback.delete({
     *   where: {
     *     // ... filter to delete one UserCompletionFeedback
     *   }
     * })
     * 
    **/
    delete<T extends UserCompletionFeedbackDeleteArgs>(
      args: SelectSubset<T, UserCompletionFeedbackDeleteArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Update one UserCompletionFeedback.
     * @param {UserCompletionFeedbackUpdateArgs} args - Arguments to update one UserCompletionFeedback.
     * @example
     * // Update one UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserCompletionFeedbackUpdateArgs>(
      args: SelectSubset<T, UserCompletionFeedbackUpdateArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Delete zero or more UserCompletionFeedbacks.
     * @param {UserCompletionFeedbackDeleteManyArgs} args - Arguments to filter UserCompletionFeedbacks to delete.
     * @example
     * // Delete a few UserCompletionFeedbacks
     * const { count } = await prisma.userCompletionFeedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserCompletionFeedbackDeleteManyArgs>(
      args?: SelectSubset<T, UserCompletionFeedbackDeleteManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCompletionFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCompletionFeedbacks
     * const userCompletionFeedback = await prisma.userCompletionFeedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserCompletionFeedbackUpdateManyArgs>(
      args: SelectSubset<T, UserCompletionFeedbackUpdateManyArgs>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserCompletionFeedback.
     * @param {UserCompletionFeedbackUpsertArgs} args - Arguments to update or create a UserCompletionFeedback.
     * @example
     * // Update or create a UserCompletionFeedback
     * const userCompletionFeedback = await prisma.userCompletionFeedback.upsert({
     *   create: {
     *     // ... data to create a UserCompletionFeedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCompletionFeedback we want to update
     *   }
     * })
    **/
    upsert<T extends UserCompletionFeedbackUpsertArgs>(
      args: SelectSubset<T, UserCompletionFeedbackUpsertArgs>
    ): Prisma__UserCompletionFeedbackClient<UserCompletionFeedbackGetPayload<T>>

    /**
     * Count the number of UserCompletionFeedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackCountArgs} args - Arguments to filter UserCompletionFeedbacks to count.
     * @example
     * // Count the number of UserCompletionFeedbacks
     * const count = await prisma.userCompletionFeedback.count({
     *   where: {
     *     // ... the filter for the UserCompletionFeedbacks we want to count
     *   }
     * })
    **/
    count<T extends UserCompletionFeedbackCountArgs>(
      args?: Subset<T, UserCompletionFeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCompletionFeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCompletionFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserCompletionFeedbackAggregateArgs>(args: Subset<T, UserCompletionFeedbackAggregateArgs>): Prisma.PrismaPromise<GetUserCompletionFeedbackAggregateType<T>>

    /**
     * Group by UserCompletionFeedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCompletionFeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserCompletionFeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCompletionFeedbackGroupByArgs['orderBy'] }
        : { orderBy?: UserCompletionFeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserCompletionFeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCompletionFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCompletionFeedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__UserCompletionFeedbackClient<T, Null = never> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * UserCompletionFeedback base type for findUnique actions
   */
  export type UserCompletionFeedbackFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter, which UserCompletionFeedback to fetch.
     */
    where: UserCompletionFeedbackWhereUniqueInput
  }

  /**
   * UserCompletionFeedback findUnique
   */
  export interface UserCompletionFeedbackFindUniqueArgs extends UserCompletionFeedbackFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserCompletionFeedback findUniqueOrThrow
   */
  export type UserCompletionFeedbackFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter, which UserCompletionFeedback to fetch.
     */
    where: UserCompletionFeedbackWhereUniqueInput
  }


  /**
   * UserCompletionFeedback base type for findFirst actions
   */
  export type UserCompletionFeedbackFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter, which UserCompletionFeedback to fetch.
     */
    where?: UserCompletionFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCompletionFeedbacks to fetch.
     */
    orderBy?: Enumerable<UserCompletionFeedbackOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCompletionFeedbacks.
     */
    cursor?: UserCompletionFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCompletionFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCompletionFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCompletionFeedbacks.
     */
    distinct?: Enumerable<UserCompletionFeedbackScalarFieldEnum>
  }

  /**
   * UserCompletionFeedback findFirst
   */
  export interface UserCompletionFeedbackFindFirstArgs extends UserCompletionFeedbackFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * UserCompletionFeedback findFirstOrThrow
   */
  export type UserCompletionFeedbackFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter, which UserCompletionFeedback to fetch.
     */
    where?: UserCompletionFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCompletionFeedbacks to fetch.
     */
    orderBy?: Enumerable<UserCompletionFeedbackOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCompletionFeedbacks.
     */
    cursor?: UserCompletionFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCompletionFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCompletionFeedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCompletionFeedbacks.
     */
    distinct?: Enumerable<UserCompletionFeedbackScalarFieldEnum>
  }


  /**
   * UserCompletionFeedback findMany
   */
  export type UserCompletionFeedbackFindManyArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter, which UserCompletionFeedbacks to fetch.
     */
    where?: UserCompletionFeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCompletionFeedbacks to fetch.
     */
    orderBy?: Enumerable<UserCompletionFeedbackOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCompletionFeedbacks.
     */
    cursor?: UserCompletionFeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCompletionFeedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCompletionFeedbacks.
     */
    skip?: number
    distinct?: Enumerable<UserCompletionFeedbackScalarFieldEnum>
  }


  /**
   * UserCompletionFeedback create
   */
  export type UserCompletionFeedbackCreateArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * The data needed to create a UserCompletionFeedback.
     */
    data: XOR<UserCompletionFeedbackCreateInput, UserCompletionFeedbackUncheckedCreateInput>
  }


  /**
   * UserCompletionFeedback createMany
   */
  export type UserCompletionFeedbackCreateManyArgs = {
    /**
     * The data used to create many UserCompletionFeedbacks.
     */
    data: Enumerable<UserCompletionFeedbackCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * UserCompletionFeedback update
   */
  export type UserCompletionFeedbackUpdateArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * The data needed to update a UserCompletionFeedback.
     */
    data: XOR<UserCompletionFeedbackUpdateInput, UserCompletionFeedbackUncheckedUpdateInput>
    /**
     * Choose, which UserCompletionFeedback to update.
     */
    where: UserCompletionFeedbackWhereUniqueInput
  }


  /**
   * UserCompletionFeedback updateMany
   */
  export type UserCompletionFeedbackUpdateManyArgs = {
    /**
     * The data used to update UserCompletionFeedbacks.
     */
    data: XOR<UserCompletionFeedbackUpdateManyMutationInput, UserCompletionFeedbackUncheckedUpdateManyInput>
    /**
     * Filter which UserCompletionFeedbacks to update
     */
    where?: UserCompletionFeedbackWhereInput
  }


  /**
   * UserCompletionFeedback upsert
   */
  export type UserCompletionFeedbackUpsertArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * The filter to search for the UserCompletionFeedback to update in case it exists.
     */
    where: UserCompletionFeedbackWhereUniqueInput
    /**
     * In case the UserCompletionFeedback found by the `where` argument doesn't exist, create a new UserCompletionFeedback with this data.
     */
    create: XOR<UserCompletionFeedbackCreateInput, UserCompletionFeedbackUncheckedCreateInput>
    /**
     * In case the UserCompletionFeedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCompletionFeedbackUpdateInput, UserCompletionFeedbackUncheckedUpdateInput>
  }


  /**
   * UserCompletionFeedback delete
   */
  export type UserCompletionFeedbackDeleteArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
    /**
     * Filter which UserCompletionFeedback to delete.
     */
    where: UserCompletionFeedbackWhereUniqueInput
  }


  /**
   * UserCompletionFeedback deleteMany
   */
  export type UserCompletionFeedbackDeleteManyArgs = {
    /**
     * Filter which UserCompletionFeedbacks to delete
     */
    where?: UserCompletionFeedbackWhereInput
  }


  /**
   * UserCompletionFeedback without action
   */
  export type UserCompletionFeedbackArgs = {
    /**
     * Select specific fields to fetch from the UserCompletionFeedback
     */
    select?: UserCompletionFeedbackSelect | null
  }



  /**
   * Enums
   */

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const OpenAiCompletionScalarFieldEnum: {
    id: 'id',
    referenceId: 'referenceId',
    createdAt: 'createdAt',
    requesterUserId: 'requesterUserId',
    requesterTeamId: 'requesterTeamId',
    requesterCompanyId: 'requesterCompanyId',
    action: 'action',
    entity: 'entity',
    model: 'model',
    messages: 'messages',
    input: 'input',
    request: 'request',
    status: 'status',
    requestedAt: 'requestedAt',
    respondedAt: 'respondedAt',
    completionTokens: 'completionTokens',
    promptTokens: 'promptTokens',
    totalTokens: 'totalTokens',
    estimatedCompletionTokens: 'estimatedCompletionTokens',
    estimatedPromptTokens: 'estimatedPromptTokens',
    output: 'output',
    response: 'response'
  };

  export type OpenAiCompletionScalarFieldEnum = (typeof OpenAiCompletionScalarFieldEnum)[keyof typeof OpenAiCompletionScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserCompletionFeedbackScalarFieldEnum: {
    userId: 'userId',
    completionId: 'completionId',
    value: 'value',
    vendor: 'vendor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserCompletionFeedbackScalarFieldEnum = (typeof UserCompletionFeedbackScalarFieldEnum)[keyof typeof UserCompletionFeedbackScalarFieldEnum]


  /**
   * Deep Input Types
   */


  export type OpenAiCompletionWhereInput = {
    AND?: Enumerable<OpenAiCompletionWhereInput>
    OR?: Enumerable<OpenAiCompletionWhereInput>
    NOT?: Enumerable<OpenAiCompletionWhereInput>
    id?: StringFilter | string
    referenceId?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    requesterUserId?: StringFilter | string
    requesterTeamId?: StringFilter | string
    requesterCompanyId?: StringFilter | string
    action?: EnumActionTypeFilter | ActionType
    entity?: EnumTargetEntityFilter | TargetEntity
    model?: StringFilter | string
    messages?: JsonFilter
    input?: JsonFilter
    request?: JsonFilter
    status?: EnumOpenAiCompletionStatusFilter | OpenAiCompletionStatus
    requestedAt?: DateTimeNullableFilter | Date | string | null
    respondedAt?: DateTimeNullableFilter | Date | string | null
    completionTokens?: IntNullableFilter | number | null
    promptTokens?: IntNullableFilter | number | null
    totalTokens?: IntNullableFilter | number | null
    estimatedCompletionTokens?: IntNullableFilter | number | null
    estimatedPromptTokens?: IntNullableFilter | number | null
    output?: StringNullableFilter | string | null
    response?: JsonNullableFilter
  }

  export type OpenAiCompletionOrderByWithRelationInput = {
    id?: SortOrder
    referenceId?: SortOrder
    createdAt?: SortOrder
    requesterUserId?: SortOrder
    requesterTeamId?: SortOrder
    requesterCompanyId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    model?: SortOrder
    messages?: SortOrder
    input?: SortOrder
    request?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
    output?: SortOrder
    response?: SortOrder
  }

  export type OpenAiCompletionWhereUniqueInput = {
    id?: string
  }

  export type OpenAiCompletionOrderByWithAggregationInput = {
    id?: SortOrder
    referenceId?: SortOrder
    createdAt?: SortOrder
    requesterUserId?: SortOrder
    requesterTeamId?: SortOrder
    requesterCompanyId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    model?: SortOrder
    messages?: SortOrder
    input?: SortOrder
    request?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
    output?: SortOrder
    response?: SortOrder
    _count?: OpenAiCompletionCountOrderByAggregateInput
    _avg?: OpenAiCompletionAvgOrderByAggregateInput
    _max?: OpenAiCompletionMaxOrderByAggregateInput
    _min?: OpenAiCompletionMinOrderByAggregateInput
    _sum?: OpenAiCompletionSumOrderByAggregateInput
  }

  export type OpenAiCompletionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<OpenAiCompletionScalarWhereWithAggregatesInput>
    OR?: Enumerable<OpenAiCompletionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<OpenAiCompletionScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    referenceId?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    requesterUserId?: StringWithAggregatesFilter | string
    requesterTeamId?: StringWithAggregatesFilter | string
    requesterCompanyId?: StringWithAggregatesFilter | string
    action?: EnumActionTypeWithAggregatesFilter | ActionType
    entity?: EnumTargetEntityWithAggregatesFilter | TargetEntity
    model?: StringWithAggregatesFilter | string
    messages?: JsonWithAggregatesFilter
    input?: JsonWithAggregatesFilter
    request?: JsonWithAggregatesFilter
    status?: EnumOpenAiCompletionStatusWithAggregatesFilter | OpenAiCompletionStatus
    requestedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    respondedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    completionTokens?: IntNullableWithAggregatesFilter | number | null
    promptTokens?: IntNullableWithAggregatesFilter | number | null
    totalTokens?: IntNullableWithAggregatesFilter | number | null
    estimatedCompletionTokens?: IntNullableWithAggregatesFilter | number | null
    estimatedPromptTokens?: IntNullableWithAggregatesFilter | number | null
    output?: StringNullableWithAggregatesFilter | string | null
    response?: JsonNullableWithAggregatesFilter
  }

  export type UserCompletionFeedbackWhereInput = {
    AND?: Enumerable<UserCompletionFeedbackWhereInput>
    OR?: Enumerable<UserCompletionFeedbackWhereInput>
    NOT?: Enumerable<UserCompletionFeedbackWhereInput>
    userId?: StringFilter | string
    completionId?: StringFilter | string
    value?: IntFilter | number
    vendor?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type UserCompletionFeedbackOrderByWithRelationInput = {
    userId?: SortOrder
    completionId?: SortOrder
    value?: SortOrder
    vendor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCompletionFeedbackWhereUniqueInput = {
    userId_completionId?: UserCompletionFeedbackUserIdCompletionIdCompoundUniqueInput
  }

  export type UserCompletionFeedbackOrderByWithAggregationInput = {
    userId?: SortOrder
    completionId?: SortOrder
    value?: SortOrder
    vendor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCompletionFeedbackCountOrderByAggregateInput
    _avg?: UserCompletionFeedbackAvgOrderByAggregateInput
    _max?: UserCompletionFeedbackMaxOrderByAggregateInput
    _min?: UserCompletionFeedbackMinOrderByAggregateInput
    _sum?: UserCompletionFeedbackSumOrderByAggregateInput
  }

  export type UserCompletionFeedbackScalarWhereWithAggregatesInput = {
    AND?: Enumerable<UserCompletionFeedbackScalarWhereWithAggregatesInput>
    OR?: Enumerable<UserCompletionFeedbackScalarWhereWithAggregatesInput>
    NOT?: Enumerable<UserCompletionFeedbackScalarWhereWithAggregatesInput>
    userId?: StringWithAggregatesFilter | string
    completionId?: StringWithAggregatesFilter | string
    value?: IntWithAggregatesFilter | number
    vendor?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type OpenAiCompletionCreateInput = {
    id: string
    referenceId: string
    createdAt?: Date | string
    requesterUserId: string
    requesterTeamId: string
    requesterCompanyId: string
    action: ActionType
    entity: TargetEntity
    model: string
    messages: JsonNullValueInput | InputJsonValue
    input: JsonNullValueInput | InputJsonValue
    request: JsonNullValueInput | InputJsonValue
    status: OpenAiCompletionStatus
    requestedAt?: Date | string | null
    respondedAt?: Date | string | null
    completionTokens?: number | null
    promptTokens?: number | null
    totalTokens?: number | null
    estimatedCompletionTokens?: number | null
    estimatedPromptTokens?: number | null
    output?: string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionUncheckedCreateInput = {
    id: string
    referenceId: string
    createdAt?: Date | string
    requesterUserId: string
    requesterTeamId: string
    requesterCompanyId: string
    action: ActionType
    entity: TargetEntity
    model: string
    messages: JsonNullValueInput | InputJsonValue
    input: JsonNullValueInput | InputJsonValue
    request: JsonNullValueInput | InputJsonValue
    status: OpenAiCompletionStatus
    requestedAt?: Date | string | null
    respondedAt?: Date | string | null
    completionTokens?: number | null
    promptTokens?: number | null
    totalTokens?: number | null
    estimatedCompletionTokens?: number | null
    estimatedPromptTokens?: number | null
    output?: string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    referenceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requesterUserId?: StringFieldUpdateOperationsInput | string
    requesterTeamId?: StringFieldUpdateOperationsInput | string
    requesterCompanyId?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | ActionType
    entity?: EnumTargetEntityFieldUpdateOperationsInput | TargetEntity
    model?: StringFieldUpdateOperationsInput | string
    messages?: JsonNullValueInput | InputJsonValue
    input?: JsonNullValueInput | InputJsonValue
    request?: JsonNullValueInput | InputJsonValue
    status?: EnumOpenAiCompletionStatusFieldUpdateOperationsInput | OpenAiCompletionStatus
    requestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    promptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    output?: NullableStringFieldUpdateOperationsInput | string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    referenceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requesterUserId?: StringFieldUpdateOperationsInput | string
    requesterTeamId?: StringFieldUpdateOperationsInput | string
    requesterCompanyId?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | ActionType
    entity?: EnumTargetEntityFieldUpdateOperationsInput | TargetEntity
    model?: StringFieldUpdateOperationsInput | string
    messages?: JsonNullValueInput | InputJsonValue
    input?: JsonNullValueInput | InputJsonValue
    request?: JsonNullValueInput | InputJsonValue
    status?: EnumOpenAiCompletionStatusFieldUpdateOperationsInput | OpenAiCompletionStatus
    requestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    promptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    output?: NullableStringFieldUpdateOperationsInput | string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionCreateManyInput = {
    id: string
    referenceId: string
    createdAt?: Date | string
    requesterUserId: string
    requesterTeamId: string
    requesterCompanyId: string
    action: ActionType
    entity: TargetEntity
    model: string
    messages: JsonNullValueInput | InputJsonValue
    input: JsonNullValueInput | InputJsonValue
    request: JsonNullValueInput | InputJsonValue
    status: OpenAiCompletionStatus
    requestedAt?: Date | string | null
    respondedAt?: Date | string | null
    completionTokens?: number | null
    promptTokens?: number | null
    totalTokens?: number | null
    estimatedCompletionTokens?: number | null
    estimatedPromptTokens?: number | null
    output?: string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    referenceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requesterUserId?: StringFieldUpdateOperationsInput | string
    requesterTeamId?: StringFieldUpdateOperationsInput | string
    requesterCompanyId?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | ActionType
    entity?: EnumTargetEntityFieldUpdateOperationsInput | TargetEntity
    model?: StringFieldUpdateOperationsInput | string
    messages?: JsonNullValueInput | InputJsonValue
    input?: JsonNullValueInput | InputJsonValue
    request?: JsonNullValueInput | InputJsonValue
    status?: EnumOpenAiCompletionStatusFieldUpdateOperationsInput | OpenAiCompletionStatus
    requestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    promptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    output?: NullableStringFieldUpdateOperationsInput | string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type OpenAiCompletionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    referenceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requesterUserId?: StringFieldUpdateOperationsInput | string
    requesterTeamId?: StringFieldUpdateOperationsInput | string
    requesterCompanyId?: StringFieldUpdateOperationsInput | string
    action?: EnumActionTypeFieldUpdateOperationsInput | ActionType
    entity?: EnumTargetEntityFieldUpdateOperationsInput | TargetEntity
    model?: StringFieldUpdateOperationsInput | string
    messages?: JsonNullValueInput | InputJsonValue
    input?: JsonNullValueInput | InputJsonValue
    request?: JsonNullValueInput | InputJsonValue
    status?: EnumOpenAiCompletionStatusFieldUpdateOperationsInput | OpenAiCompletionStatus
    requestedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    respondedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    promptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    estimatedPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    output?: NullableStringFieldUpdateOperationsInput | string | null
    response?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserCompletionFeedbackCreateInput = {
    userId: string
    completionId: string
    value: number
    vendor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCompletionFeedbackUncheckedCreateInput = {
    userId: string
    completionId: string
    value: number
    vendor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCompletionFeedbackUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    completionId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    vendor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCompletionFeedbackUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    completionId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    vendor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCompletionFeedbackCreateManyInput = {
    userId: string
    completionId: string
    value: number
    vendor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCompletionFeedbackUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    completionId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    vendor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCompletionFeedbackUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    completionId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    vendor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type EnumActionTypeFilter = {
    equals?: ActionType
    in?: Enumerable<ActionType>
    notIn?: Enumerable<ActionType>
    not?: NestedEnumActionTypeFilter | ActionType
  }

  export type EnumTargetEntityFilter = {
    equals?: TargetEntity
    in?: Enumerable<TargetEntity>
    notIn?: Enumerable<TargetEntity>
    not?: NestedEnumTargetEntityFilter | TargetEntity
  }
  export type JsonFilter = 
    | PatchUndefined<
        Either<Required<JsonFilterBase>, Exclude<keyof Required<JsonFilterBase>, 'path'>>,
        Required<JsonFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase>, 'path'>>

  export type JsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type EnumOpenAiCompletionStatusFilter = {
    equals?: OpenAiCompletionStatus
    in?: Enumerable<OpenAiCompletionStatus>
    notIn?: Enumerable<OpenAiCompletionStatus>
    not?: NestedEnumOpenAiCompletionStatusFilter | OpenAiCompletionStatus
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type OpenAiCompletionCountOrderByAggregateInput = {
    id?: SortOrder
    referenceId?: SortOrder
    createdAt?: SortOrder
    requesterUserId?: SortOrder
    requesterTeamId?: SortOrder
    requesterCompanyId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    model?: SortOrder
    messages?: SortOrder
    input?: SortOrder
    request?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
    output?: SortOrder
    response?: SortOrder
  }

  export type OpenAiCompletionAvgOrderByAggregateInput = {
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
  }

  export type OpenAiCompletionMaxOrderByAggregateInput = {
    id?: SortOrder
    referenceId?: SortOrder
    createdAt?: SortOrder
    requesterUserId?: SortOrder
    requesterTeamId?: SortOrder
    requesterCompanyId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    model?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
    output?: SortOrder
  }

  export type OpenAiCompletionMinOrderByAggregateInput = {
    id?: SortOrder
    referenceId?: SortOrder
    createdAt?: SortOrder
    requesterUserId?: SortOrder
    requesterTeamId?: SortOrder
    requesterCompanyId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    model?: SortOrder
    status?: SortOrder
    requestedAt?: SortOrder
    respondedAt?: SortOrder
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
    output?: SortOrder
  }

  export type OpenAiCompletionSumOrderByAggregateInput = {
    completionTokens?: SortOrder
    promptTokens?: SortOrder
    totalTokens?: SortOrder
    estimatedCompletionTokens?: SortOrder
    estimatedPromptTokens?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type EnumActionTypeWithAggregatesFilter = {
    equals?: ActionType
    in?: Enumerable<ActionType>
    notIn?: Enumerable<ActionType>
    not?: NestedEnumActionTypeWithAggregatesFilter | ActionType
    _count?: NestedIntFilter
    _min?: NestedEnumActionTypeFilter
    _max?: NestedEnumActionTypeFilter
  }

  export type EnumTargetEntityWithAggregatesFilter = {
    equals?: TargetEntity
    in?: Enumerable<TargetEntity>
    notIn?: Enumerable<TargetEntity>
    not?: NestedEnumTargetEntityWithAggregatesFilter | TargetEntity
    _count?: NestedIntFilter
    _min?: NestedEnumTargetEntityFilter
    _max?: NestedEnumTargetEntityFilter
  }
  export type JsonWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase>, Exclude<keyof Required<JsonWithAggregatesFilterBase>, 'path'>>,
        Required<JsonWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase>, 'path'>>

  export type JsonWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntFilter
    _min?: NestedJsonFilter
    _max?: NestedJsonFilter
  }

  export type EnumOpenAiCompletionStatusWithAggregatesFilter = {
    equals?: OpenAiCompletionStatus
    in?: Enumerable<OpenAiCompletionStatus>
    notIn?: Enumerable<OpenAiCompletionStatus>
    not?: NestedEnumOpenAiCompletionStatusWithAggregatesFilter | OpenAiCompletionStatus
    _count?: NestedIntFilter
    _min?: NestedEnumOpenAiCompletionStatusFilter
    _max?: NestedEnumOpenAiCompletionStatusFilter
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type UserCompletionFeedbackUserIdCompletionIdCompoundUniqueInput = {
    userId: string
    completionId: string
  }

  export type UserCompletionFeedbackCountOrderByAggregateInput = {
    userId?: SortOrder
    completionId?: SortOrder
    value?: SortOrder
    vendor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCompletionFeedbackAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type UserCompletionFeedbackMaxOrderByAggregateInput = {
    userId?: SortOrder
    completionId?: SortOrder
    value?: SortOrder
    vendor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCompletionFeedbackMinOrderByAggregateInput = {
    userId?: SortOrder
    completionId?: SortOrder
    value?: SortOrder
    vendor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCompletionFeedbackSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumActionTypeFieldUpdateOperationsInput = {
    set?: ActionType
  }

  export type EnumTargetEntityFieldUpdateOperationsInput = {
    set?: TargetEntity
  }

  export type EnumOpenAiCompletionStatusFieldUpdateOperationsInput = {
    set?: OpenAiCompletionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedEnumActionTypeFilter = {
    equals?: ActionType
    in?: Enumerable<ActionType>
    notIn?: Enumerable<ActionType>
    not?: NestedEnumActionTypeFilter | ActionType
  }

  export type NestedEnumTargetEntityFilter = {
    equals?: TargetEntity
    in?: Enumerable<TargetEntity>
    notIn?: Enumerable<TargetEntity>
    not?: NestedEnumTargetEntityFilter | TargetEntity
  }

  export type NestedEnumOpenAiCompletionStatusFilter = {
    equals?: OpenAiCompletionStatus
    in?: Enumerable<OpenAiCompletionStatus>
    notIn?: Enumerable<OpenAiCompletionStatus>
    not?: NestedEnumOpenAiCompletionStatusFilter | OpenAiCompletionStatus
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedEnumActionTypeWithAggregatesFilter = {
    equals?: ActionType
    in?: Enumerable<ActionType>
    notIn?: Enumerable<ActionType>
    not?: NestedEnumActionTypeWithAggregatesFilter | ActionType
    _count?: NestedIntFilter
    _min?: NestedEnumActionTypeFilter
    _max?: NestedEnumActionTypeFilter
  }

  export type NestedEnumTargetEntityWithAggregatesFilter = {
    equals?: TargetEntity
    in?: Enumerable<TargetEntity>
    notIn?: Enumerable<TargetEntity>
    not?: NestedEnumTargetEntityWithAggregatesFilter | TargetEntity
    _count?: NestedIntFilter
    _min?: NestedEnumTargetEntityFilter
    _max?: NestedEnumTargetEntityFilter
  }
  export type NestedJsonFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase>, Exclude<keyof Required<NestedJsonFilterBase>, 'path'>>,
        Required<NestedJsonFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase>, 'path'>>

  export type NestedJsonFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedEnumOpenAiCompletionStatusWithAggregatesFilter = {
    equals?: OpenAiCompletionStatus
    in?: Enumerable<OpenAiCompletionStatus>
    notIn?: Enumerable<OpenAiCompletionStatus>
    not?: NestedEnumOpenAiCompletionStatusWithAggregatesFilter | OpenAiCompletionStatus
    _count?: NestedIntFilter
    _min?: NestedEnumOpenAiCompletionStatusFilter
    _max?: NestedEnumOpenAiCompletionStatusFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}