import { createServer } from '../../src/app'

export const withServer = async (databaseUrl: string) => {
  const app = await createServer({
    NODE_ENV: 'test',
    PORT: 0, // pick an ephemeral port for testing
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: 'access_test_secret_key',
    JWT_REFRESH_SECRET: 'refresh_test_secret_key',
  })

  await app.ready()
  return app
}
