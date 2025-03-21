import { Hono } from 'hono'
import { prisma } from './index.js'


const app = new Hono()

app.post('/', async (c) => {
    const body = await c.req.json()

    try {
        const newRestaurant = await prisma.restaurant.create({
            data: {
                name: body.name,
                location: body.location
            }
        })

        return c.json(newRestaurant, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create restaurant' }, 400)
    }
})

app.get('/:id/menu', async (c) => {
    const id = parseInt(c.req.param('id'))

    try {
        const menuItems = await prisma.menuItem.findMany({
            where: {
                restaurantId: id,
                isAvailable: true
            }
        })

        return c.json(menuItems)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve menu items' }, 400)
    }
})

app.post('/:id/menu', async (c) => {
    const restaurantId = parseInt(c.req.param('id'))
    const body = await c.req.json()

    try {
        const newMenuItem = await prisma.menuItem.create({
            data: {
                restaurantId,
                name: body.name,
                price: body.price,
                isAvailable: body.isAvailable !== undefined ? body.isAvailable : true
            }
        })

        return c.json(newMenuItem, 201)
    } catch (error) {
        return c.json({ error: 'Failed to create menu item' }, 400)
    }
})

app.get('/:id/revenue', async (c) => {
    const id = parseInt(c.req.param('id'))

    try {
        const orders = await prisma.order.findMany({
            where: {
                restaurantId: id,
                status: { not: 'Cancelled' }
            },
            select: {
                totalPrice: true
            }
        })

        const totalRevenue = orders.reduce((sum: any, order: any) => {
            return sum + Number(order.totalPrice)
        }, 0)

        return c.json({ restaurantId: id, totalRevenue })
    } catch (error) {
        return c.json({ error: 'Failed to calculate revenue' }, 400)
    }
})

export default app