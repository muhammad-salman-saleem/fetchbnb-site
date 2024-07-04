// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method !== 'GET') {
            return res.status(400).json({ name: 'Bad Request' })
        }
        const id = req.query?.id as string

        const coach = await prisma.coach.findUnique({
            where: { id },
            include: {
                tags: true,
                reviews: true,
                images: true
            }
        });

        res.setHeader('Cache-Control', 's-maxage=3600'); //revalidate cache every hour
        return res.status(200).json(coach);
    } catch (error: any) {
        res.setHeader('Cache-Control', 's-maxage=3600'); //revalidate cache every hour
        res.status(500).json({ error: error.message })
    }
}
