import { createServerConfig } from '@config/server/server.factory'
import { ServerFactory } from '@infrastructure/server/server.factory'

const serverConfig = createServerConfig()
const serverFactory = new ServerFactory(serverConfig)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
serverFactory.bootstrap()
