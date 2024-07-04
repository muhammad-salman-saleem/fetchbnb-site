import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { houseSearch } from '../../utils/str';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = any

//city, zip_code, adddress, bedrooms, bathrooms, state
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    try {
        const city = req.query.city as string
        const address = req.query.address as string
        const state = req.query.state as string
        const bedrooms = parseInt(req.query.bedrooms as string)
        let bathrooms = parseInt(req.query.bathrooms as string)
        const zip = parseInt(req.query.zip_code as string)
        const forwarded: any = req.headers["x-forwarded-for"]
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

        const demoUsers: any = await prisma.demoUser.findMany({
            where: {
                ip
            }
        })
        const demoUser = demoUsers[0];
        // console.log({ demoUser })
        if (demoUser === null) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        if (demoUser !== undefined && demoUser?.uses >= 2 && state.toLowerCase() !== 'louisiana' && city.toLowerCase() !== 'covington') {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        if (!(bathrooms > 0)) {
            bathrooms = 1 //hard coded defaults
        }
        if (!(bedrooms > 0)) {
            bathrooms = 1 //hard coded defaults
        }
        // if it's covington, la, send back cached JSON
        let paramsStr = new URLSearchParams({
            address,
            city,
            zip_code: zip.toString(),
            state,
            bedrooms: bedrooms.toString(),
            bathrooms: bathrooms.toString(),
        })
        // use an env var for URL, it needs aboslute
        const strResponse = await fetch(process.env.STR_DEMO_API_URL as string + paramsStr, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const strData = await strResponse.json();
        res.status(200).json(strData)
    } catch (e) {
        console.log(e)
        res.status(500).json({ name: 'Internal Server Error', e })
        console.log('e')
    }
}
