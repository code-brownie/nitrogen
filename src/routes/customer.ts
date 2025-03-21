import { Hono } from 'hono'
import { prisma } from '../index.js'

const app = new Hono()

app.post('/', async (c) => {
    const body = await c.req.json()

    try {
        const newCustomer = await prisma.customer.create({
            data: {
                name: body.name,
                email: body.email,
                phoneNumber: body.phoneNumber,
                address: body.address
            }
        })

        return c.json(newCustomer, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create customer' }, 400)
    }
})

app.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))

    try {
        const customer = await prisma.customer.findUnique({
            where: { id }
        })

        if (!customer) {
            return c.json({ error: 'Customer not found' }, 404)
        }

        return c.json(customer)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve customer' }, 400)
    }
})

app.get('/:id/orders', async (c) => {
    const id = parseInt(c.req.param('id'))

    try {
        const orders = await prisma.order.findMany({
            where: { customerId: id },
            include: {
                restaurant: true,
                orderItems: {
                    include: {
                        menuItem: true
                    }
                }
            }
        })

        return c.json(orders)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve orders' }, 400)
    }
})

app.get('/top', async (c) => {
    try {
        const topCustomers = await prisma.customer.findMany({
            take: 5,
            orderBy: {
                orders: {
                    _count: 'desc'
                }
            },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        })

        return c.json(topCustomers)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve top customers' }, 400)
    }
})

export default app