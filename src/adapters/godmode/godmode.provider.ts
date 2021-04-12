import { GodmodePropertiesInterface } from './interfaces/godmode-properties.interface'

export class GodmodeProvider implements GodmodePropertiesInterface {
  public readonly enabled: boolean

  constructor(properties: GodmodePropertiesInterface) {
    this.enabled = properties.enabled
  }
}
