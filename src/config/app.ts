const { PORT } = process.env

export interface ConfigOptions {
  port: number
}

const config = (): ConfigOptions => ({
  port: Number.parseInt(PORT, 10) || 3000,
})

export default config
