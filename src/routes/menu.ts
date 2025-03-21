import { Hono } from 'hono'
import { prisma } from '../index.js'

const app = new Hono()

app.patch('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()

    try {
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id },
            data: {
                price: body.price,
                isAvailable: body.isAvailable
            }
        })

        return c.json(updatedMenuItem)
    } catch (error) {
        return c.json({ error: 'Failed to update menu item' }, 400)
    }
})

app.get('/top-items', async (c) => {
    try {
        const topItems = await prisma.menuItem.findMany({
            take: 10,
            orderBy: {
                orderItems: {
                    _count: 'desc'
                }
            },
            include: {
                restaurant: true,
                _count: {
                    select: { orderItems: true }
                }
            }
        })

        return c.json(topItems)
    } catch (error) {
        return c.json({ error: 'Failed to retrieve top menu items' }, 400)
    }
})

export default app