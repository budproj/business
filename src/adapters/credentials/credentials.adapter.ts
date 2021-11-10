import { Credential, NewCredentialData } from './credentials.interface'

export interface CredentialsAdapter {
  generatePassword(): string
  create(data: NewCredentialData): Promise<Credential>
  blockUser(userID: string): Promise<boolean>
  updateEmail(userID: string, email: string): Promise<boolean>
  invite(email: string): Promise<void>
}
