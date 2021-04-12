import { GodmodeClassInterface } from '../interfaces/godmode-class.interface'

export function GodBypass() {
  return function (_: unknown, key: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function (this: GodmodeClassInterface, ...methodArguments: any[]) {
      if (this.godmode.enabled) {
        this.logger.debug(`Godmode enabled, bypassing ${key} method`)
        return
      }

      return method.apply(this, methodArguments)
    }
  }
}
