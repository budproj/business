import { ServerFactory } from '@infrastructure/server/server.factory'

const serverFactory = new ServerFactory()
// eslint-disable-next-line @typescript-eslint/no-floating-promises
serverFactory.bootstrap()
