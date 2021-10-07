export interface CredentialsAdapter {
  blockUser(userID: string): Promise<boolean>
}
