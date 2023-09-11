export abstract class CoreDomainRepository {
  abstract findUserById(userId: string): Promise<string>
}
