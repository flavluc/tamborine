import { env } from './config'
import { createServer } from './app'

const start = async () => {
  const app = await createServer()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`api running on ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
