export abstract class HashProvider {
  abstract generateHash(input: any): Promise<string>
}
