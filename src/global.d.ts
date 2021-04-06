declare module 'lodash' {
  const zipObject: <P extends PropertyName, T>(properties: List<P>, values: List<T>) => Record<P, T>
}
