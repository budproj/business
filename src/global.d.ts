import 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    zipObject<P extends PropertyName, T>(properties: List<P>, values: List<T>): Record<P, T>
  }
}
