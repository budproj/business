import { AppModule } from '@/app.module'
import { getServerConfig } from '@infrastructure/server/server.config'

async function bootstrap() {
  const { app, PORT } = await getServerConfig(AppModule)

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Started server listening on ${PORT}`)
  })
}

void bootstrap()
