// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import axios from 'axios';
import { Filters } from '../../shared/interfaces/Filters.d';
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import historicalOverview from '../../utils/historicalOverview';

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
        const isDemo = req.query?.isDemo as string
        const page = req.query?.page as string
        const max = req.query?.max as string
        const forwarded: any = req.headers["x-forwarded-for"]
        const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
        let userWithIpOf: any = {};
        if (isDemo !== "true") {
            const session: any = await unstable_getServerSession(req, res, authOptions as any)
            if (!session) {
                return res.status(401).json({ error: 'Unauthorized' })
            }
            if (session?.user?.plan === "UNPAID") {
                return res.status(403).json({ error: 'Forbidden, incorrect plan for task.' })
            }
        } else {
            const usersWithIpOf = await prisma.demoUser.findMany({
                where: { ip }
            });

            userWithIpOf = usersWithIpOf[0];

            if (userWithIpOf === undefined) {
                const token = crypto.randomBytes(48).toString('hex');
                userWithIpOf = await prisma.demoUser.create({
                    data: {
                        ip,
                        token: token
                    }
                })
            }
        }
        const location = req.query.location as string
        console.log(location, "LOCAL")
        const options = {
            method: 'GET',
            url: 'https://us-real-estate.p.rapidapi.com/location/suggest',
            params: { input: location },
            headers: {
                'X-RapidAPI-Key': 'd214dd74admsh775d5293948fb9bp1dc6b0jsncaf3a1b545e5',
                'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com'
            }
        };
        const dataLoc = await axios.request(options);
        const state = dataLoc.data.data[0].state_code;
        const city = dataLoc.data.data[0].city;
        const filters: Filters = {
            investorType: req.query.investorType as string,
            propertyType: req.query.propertyType as string,
            hasHoaFees: JSON.parse(req.query.hasHoaFees as string) as boolean,
            minBeds: parseInt(req.query.minBeds as string),
            minBaths: parseInt(req.query.minBaths as string),
            reducedPrice: JSON.parse(req.query.reducedPrice as string),
            hideForeclosure: JSON.parse(req.query.hideForeclosure as string),
            hoaMax: req.query.hoaMax as string,
            zipCode: req.query.zipCode as string,
            daysOnMarket: parseInt(req.query.daysOnMarket as string),
            sort: req.query.sort as string,
            maxPrice: req.query?.maxPrice as string,
            offset: parseInt(page),
            limit: parseInt(max ? max : "40")
        }
        console.log(filters, "aa")
        const data: any = await realEstate(state, city, filters);
        data.historicalOverview = await historicalOverview(state, city);
        res.setHeader('Cache-Control', 's-maxage=604800');
        if ((isDemo !== undefined && userWithIpOf?.uses <= 2) || isDemo === undefined) {
            if (isDemo !== undefined) {
                await prisma.demoUser.update({
                    where: {
                        token: userWithIpOf?.token as string
                    },
                    data: {
                        uses: userWithIpOf.uses + 1
                    }
                })
                if (userWithIpOf?.uses >= 2) {
                    return res.status(401).json({ error: "Out of free searches!" });
                }
            }
            return res.status(200).json(data)
        }
        if (userWithIpOf?.uses >= 2) {
            return res.status(401).json({ error: "Out of free searches!" });
        }
        return res.status(200).json(data)
    } catch (error: any) {
        res.setHeader('Cache-Control', 's-maxage=604800');
        res.status(500).json({ error: error.message })
    }
}
