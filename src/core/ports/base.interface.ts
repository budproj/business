export interface Port<R> {
  execute: (...properties: any[]) => R | Promise<R>
}
