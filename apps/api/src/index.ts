import * as dotenv from 'dotenv'
dotenv.config()

import { createServer } from './app'
import { Schema } from './config'

export const env = Schema.parse(process.env)

const start = async () => {
  const app = await createServer(env)

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    app.log.debug(`api running on ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
