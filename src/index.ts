import { Hono } from 'hono'
import { authMiddleware } from './middlewares/authMiddleware'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { products } from './db/schema'

export type Env = {
  DATABASE_URL : string
}
const app = new Hono<{Bindings : Env}>()

// Things which are basic need for any backend
// body, header, query parameters, sending text, sending json data, connecting to db, middlewares

// -> middlewares
// app.use(authMiddleware)

// -> sending text or jsons 
// -> second way to use middleware
app.get('/', authMiddleware , (c) => {
  return c.text('Hello Hono!')

  // return c.json({
  // message: "Hello there"})
})

// -> getting body, headers and input params
app.get('/queries' , async (c) => {
  const body = await c.req.json()
  
  console.log(body)
  console.log(c.req.query("params"))
  return c.text("Hello from getting body route")
})

// -> connecting to database
app.get('/connect' , async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL)
    const db = drizzle(sql);

    const result = await db.select().from(products)

    return c.json({
      result
    })
  } catch (error) {
    console.log(error)

    return c.text("Something went wrong :(")
  }
})

export default app
