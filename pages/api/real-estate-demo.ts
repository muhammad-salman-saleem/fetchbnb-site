// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
type Data = any

const tokenAndUser = async (req: any) => {
    const token = crypto.randomBytes(48).toString('hex');
    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    console.log(ip, 'IP FRO DEMO')
    await prisma.demoUser.create({
        data: {
            ip,
            token: token
        }
    })
    return token;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method !== 'POST') {
            return res.status(400).json({ name: 'Bad Request' })
        }
        const forwarded: any = req.headers["x-forwarded-for"]
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
        const filters = {
            minBed: parseInt(req.body.minBed),
            maxBed: parseInt(req.body.maxBed),
            minBath: parseInt(req.body.minBath),
            maxBath: parseInt(req.body.maxBath),
            investorType: req.body.investorType,
            propertyType: req.body.propertyType
        }
        const state: string = req.body.state
        const city: string = req.body.city
        console.log(state, city)
        const usersWithIpOf = await prisma.demoUser.findMany({
            where: { ip }
        });

        const userWithIpOf = usersWithIpOf[0];

        if (state.toLowerCase() === 'louisiana' && city.toLowerCase() === 'covington') {
            let params = new URLSearchParams({
                state,
                city,
                minBed: filters.minBed.toString(),
                maxBed: filters.maxBed.toString(),
                minBath: filters.minBath.toString(),
                maxBath: filters.maxBath.toString(),
                investorType: filters.investorType.toString(),
                propertyType: filters.propertyType.toString(),
            });
            const realEstateResponse = await fetch(process.env.REALESTATE_DEMO_API_URL as string + params, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await realEstateResponse.json();
            //cache this and just send JSON
            if (userWithIpOf) {
                console.log("here 1")
                return res.status(200).json(data)
            }
            console.log("here 2")
            const token = await tokenAndUser(req);
            data.authToken = token;
            return res.status(200).json(data)
        }
        if (userWithIpOf) {
            console.log("here 3")
            if (userWithIpOf.uses >= 2) {
                return res.status(401).json({ error: 'Unauthorized, real-estate' })
            }

            await prisma.demoUser.update({
                where: {
                    token: userWithIpOf?.token as string
                },
                data: {
                    uses: userWithIpOf.uses + 1
                }
            })
            let params = new URLSearchParams({
                state,
                city,
                minBed: filters.minBed.toString(),
                maxBed: filters.maxBed.toString(),
                minBath: filters.minBath.toString(),
                maxBath: filters.maxBath.toString(),
                investorType: filters.investorType.toString(),
                propertyType: filters.propertyType.toString(),
            });
            // use an env var for URL, it needs aboslute
            const realEstateResponse = await fetch(process.env.REALESTATE_DEMO_API_URL as string + params, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const realEstateData = await realEstateResponse.json();
            return res.status(200).json(realEstateData)
        }
        console.log("here 4")
        // const token = await tokenAndUser(req);
        // const data: any = await realEstate(state, city, filters);
        return res.status(500).json({ error: 'Internal Server Error' })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal Server Error', msg: e })
        console.log('e')
    }
}
