import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import customerRoutes from './routes/customer.js'
import restaurantRoutes from './routes/restaurants.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import reportRoutes from './routes/reports.js'

export const prisma = new PrismaClient()
const app = new Hono()

app.route('/customers', customerRoutes)
app.route('/restaurants', restaurantRoutes)
app.route('/menu', menuRoutes)
app.route('/orders', orderRoutes)
app.route('/', reportRoutes)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})