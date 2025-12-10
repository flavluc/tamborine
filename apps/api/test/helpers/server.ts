import { createServer } from '../../src/app'

import { Env } from '../../src/config'

export const withServer = async (databaseUrl: string) => {
  const env: Env = {
    NODE_ENV: 'test',
    PORT: 0, // pick an ephemeral port for testing
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: 'access_test_secret_key',
    JWT_REFRESH_SECRET: 'refresh_test_secret_key',
    WEB_URL: 'http://localhost:3000',
  }
  const app = await createServer(env)

  await app.ready()
  return app
}
