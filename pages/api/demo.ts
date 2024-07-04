// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        if (req.method === 'POST') {
            const email = req.body?.email;
            const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress as string;
            //check if ip or email exists in db and if it does throw an error
            const ipExists = await prisma.demoUser.findUnique({
                where: {
                    ip: ip
                }
            })
            const emailExists = false;
            if (ipExists || emailExists) {
                throw new Error('Invalid Requests!!!!!');
            }
            if (email) {
                const forwarded: any = req.headers["x-forwarded-for"]
                const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
                //generate token
                const token = crypto.randomBytes(48).toString('hex');
                await prisma.demoUser.create({
                    data: {
                        ip,
                        token: token
                    }
                })
                return res.status(200).json({ token })
            }
            throw new Error('Invalid Requests!!!!!');
        }
    } catch (error) {
        return res.status(200).json({ error: 'Invalid Requests!!!!!' })
    }
}
