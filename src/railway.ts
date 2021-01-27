import { Injectable } from '@nestjs/common'

import { RailwayError } from 'src/errors'

export type RailwayResult<E, T> = [E, T]

export interface RailwayInterface {
  execute: <T, E extends RailwayError>(promise: Promise<T>) => Promise<RailwayResult<E, T>>
}

@Injectable()
class RailwayProvider implements RailwayInterface {
  public async execute<T, E extends RailwayError = RailwayError>(
    promise: Promise<T>,
  ): Promise<RailwayResult<E, T>> {
    return promise
      .then((data: T): RailwayResult<E, T> => [undefined, data])
      .catch((error: E): RailwayResult<E, T> => [error, undefined])
  }
}

export default RailwayProvider
