import { Hono } from 'hono'
import { prisma } from '../index.js'

const app = new Hono()

app.get('/', async (c) => {
    return c.json({ message: 'Food Ordering API is running' })
})

export default app