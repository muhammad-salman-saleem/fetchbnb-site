import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = any

//city, zip_code, adddress, bedrooms, bathrooms, state
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method !== 'GET') {
            return res.status(400).json({ name: 'Bad Request' })
        }
        const email = req.query?.email as string;

        const existingEmail = await prisma.emailUser.findFirst({
            where: {
                email: email
            }
        })

        if (existingEmail) {
            return res.status(200).json({ status: "done" })
        }

        await prisma.emailUser.create({
            data: {
                email: email
            }
        })
        res.status(200).json({ status: "done" })
    } catch (e) {
        res.status(500).json({ status: 'Internal Server Error', e })
        console.log('e')
    }
}
