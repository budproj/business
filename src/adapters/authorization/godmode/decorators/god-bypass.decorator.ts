import { GodmodeClassInterface } from '../interfaces/godmode-class.interface'

export function GodBypass(value: any) {
  return function (_: unknown, key: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function (this: GodmodeClassInterface, ...methodArguments: any[]) {
      if (this.godmode.enabled) {
        return value
      }

      return method.apply(this, methodArguments)
    }
  }
}
