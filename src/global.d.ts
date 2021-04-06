import 'lodash'

declare module 'lodash' {
  type zipObject<P extends PropertyName, T> = (properties: List<P>, values: List<T>) => Record<P, T>
}
