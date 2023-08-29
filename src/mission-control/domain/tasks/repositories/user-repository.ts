export type User = {
  userId: string
  companyId: string
  teamIds: string[]
}

export interface UserRepository {
  findAll(): Promise<User[]>
  findById(userId: string): Promise<User | null>
}
