import { Injectable } from '@nestjs/common'

export type RailwayResult<E, T> = [E, T]

export type UnknownRailwayError = Record<string, unknown>

@Injectable()
export class Railway {
  async handleRailwayPromise<E, T>(promise: Promise<T>): Promise<RailwayResult<E, T>> {
    return promise
      .then((data: T): RailwayResult<E, T> => [undefined, data])
      .catch((error: E): RailwayResult<E, T> => [error, undefined])
  }
}
