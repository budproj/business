export interface NestJSGRPCService<T> {
  toPromise(): Promise<T>
}
