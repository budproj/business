import { Dictionary, Dictionary, ObjectIteratee } from 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    zipObject<P extends PropertyName, T>(properties: List<P>, values: List<T>): Record<P, T>
    mapKeys<S = Dictionary, D = Dictionary>(
      source: S,
      iteratee: ObjectIteratee<S>,
    ): Record<keyof D, D[keyof D]>
  }
}
