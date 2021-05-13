export interface EmailProviderInterface {
  send: () => Promise<void>
}
