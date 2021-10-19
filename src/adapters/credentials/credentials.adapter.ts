export interface CredentialsAdapter {
  blockUser(userID: string): Promise<boolean>
  updateEmail(userID: string, email: string): Promise<boolean>
}
