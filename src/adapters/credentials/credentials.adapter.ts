import { Role } from 'auth0'

import { Credential, NewCredentialData } from './credentials.interface'

export interface CredentialsAdapter {
  generatePassword(): string
  create(data: NewCredentialData): Promise<Credential>
  blockUser(userID: string): Promise<boolean>
  updateEmail(userID: string, email: string): Promise<boolean>
  invite(email: string): Promise<void>
  updateUserProperty(userID: string, key: string, value: string): Promise<void>
  updateUserRole(authzSubUserId: string, role: string): Promise<void>
  getUserRole(authzSubUserId: string): Promise<Role>
  requestChangeUserPassword(email: string): Promise<void>
}
