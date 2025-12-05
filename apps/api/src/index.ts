import { createServer } from "./server"

// @TODO: env parsing with zod
const port = Number(process.env.PORT ?? 5001)

const start = async () => {
  const app = await createServer()

  try {
    await app.listen({ port, host: "0.0.0.0" })
    console.log(`api running on ${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
