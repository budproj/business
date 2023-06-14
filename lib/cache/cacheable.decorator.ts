import { get } from 'lodash'
import * as zlib from 'zlib'
import * as NodeCache from 'node-cache'
import * as objectHash from 'object-hash'

type KeyGetter =
  | Parameters<typeof get>[1]
  | ((...arguments_: any[]) => string | Parameters<typeof objectHash.sha1>[0])

const JSON_DATE_KEY = '__@Cacheable_Date';

const compress = (object) => {
  const json = JSON.stringify(object, function (key, value) {
    if (this[key] instanceof Date) {
      return { [JSON_DATE_KEY]: this[key].toISOString() };
    }
    return value;
  })

  return json ? zlib.brotliCompressSync(json) : undefined
}

const decompress = (compressedValue) => {
  const json = zlib.brotliDecompressSync(compressedValue).toString()
  return JSON.parse(json, function (key, value) {
    if (value && value[JSON_DATE_KEY]) {
      return new Date(value[JSON_DATE_KEY]);
    }
    return value;
  })
}

/**
 * @deprecated this is probably one of the worst ways to implement a cache, but still acceptable due to our limited resources and current backend overload
 * Use this method with caution
 */
export const Cacheable = (
  /**
   * Path to the key in the arguments array, or a function that returns the key
   */
  keyGetter: KeyGetter,
  /**
   * TTL in seconds, or a function that returns the TTL in seconds
   */
  ttlOrGetter: number | (<T>(result: T) => number),
  /**
   * Optional NodeCache options object
   */
  options: {
    uncompressed?: boolean,
    cache?: NodeCache.Options,
  } = {},
): MethodDecorator => {
  const cache = new NodeCache({
    useClones: false,
    ...options.cache,
  })

  const compressedCache = new NodeCache({
    useClones: false,
    ...options.cache,
  })

  const ttlGetter = typeof ttlOrGetter === 'function' ? ttlOrGetter : () => ttlOrGetter

  return <T extends Record<string, unknown>>(target, propertyKey, descriptor) => {
    const contextName = `${target.constructor.name}.${String(propertyKey)}`
    const original = descriptor.value

    const getKey =
      typeof keyGetter === 'function' ? keyGetter : (...arguments_) => get(arguments_, keyGetter)

    descriptor.value = new Proxy(original, {
      apply: (target, thisArgument, arguments_) => {
        const providedKey = getKey(...arguments_)

        const callOriginal = () => target.apply(thisArgument, arguments_)

        let safeKey

        try {
          safeKey =
            typeof providedKey === 'string'
              ? providedKey
              : objectHash(providedKey, {
                  ignoreUnknown: true,
                  respectType: false,
                })

          if (safeKey === undefined) {
            console.warn(
              `@Cacheable at ${contextName} received undefined key, which is probably a mistake. Falling back to original method for safety reasons.`,
            )
            return callOriginal()
          }
        } catch (error: unknown) {
          console.warn(
            `@Cacheable at ${contextName} failed. Falling back to original method:`,
            error,
          )
          return callOriginal()
        }

        if (compressedCache.has(safeKey)) {
          return compressedCache.get<Promise<Buffer | undefined>>(safeKey).then((compressedValue) => {
            return compressedValue ? decompress(compressedValue) : undefined
          })
        }

        if (cache.has(safeKey)) {
          return cache.get<Promise<unknown>>(safeKey)
        }

        const result = callOriginal()

        if (result instanceof Promise) {
          cache.set(safeKey, result, ttlGetter(result))

          if (!options.uncompressed) {
            return result.then(value => {
              const compressedValue = compress(value)
              const compressedPromise = Promise.resolve(compressedValue)

              // Replace cached promise with compressed value
              cache.del(safeKey)
              compressedCache.set<Promise<Buffer | undefined>>(safeKey, compressedPromise, ttlGetter(value))

              return value
            })
          }

          return result
        }

        // Only promises are cached
        return result
      },
    })

    // Copy all metadata from original descriptor.value to ensure the proper functioning of other decorators (like @Get, @Post, etc)
    for (const key of Reflect.getMetadataKeys(original)) {
      const metadata = Reflect.getMetadata(key, original)
      Reflect.defineMetadata(key, metadata, descriptor.value)
    }

    return descriptor
  }
}
