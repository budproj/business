export type User = {
  userId: string
  companyId: string
  teamIds: string[]
}

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>
  abstract findById(userId: string): Promise<User | null>
}
