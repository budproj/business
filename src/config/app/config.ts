const { PORT } = process.env

export interface AppConfigOptions {
  port: number
}

const config: AppConfigOptions = {
  port: Number.parseInt(PORT, 10) || 3000,
}

export default config
