// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { hotels } from '../../utils/hotels'
import { ltr } from '../../utils/ltr'
import ordinances from '../../utils/ordinances'
import historical from '../../utils/historical';
import poi from '../../utils/poi';
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    const isDemo = req.query?.isDemo as string
    if (isDemo !== "true") {
        const session: any = await unstable_getServerSession(req, res, authOptions as any)
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        if (session?.user?.plan === "ZONING" || session?.user?.plan === "UNPAID") {
            return res.status(403).json({ error: 'Forbidden, incorrect plan for task.' })
        }
    }
    const state: string = req.body.state
    const city: string = req.body.city
    const zip: string = req.body.zip
    const line: string = req.body.line
    const stateCode: string = req.body.stateCode
    const beds: string = req.body.beds
    const baths: string = req.body.baths
    const county: any = req.body.county
    const sqft: number = parseInt(req.body.sqft)
    const coords: { lat: number, lng: number } = req.body.coords

    const address = line + ", " + city + ", " + stateCode + ", " + zip
    const ltrData: any = await ltr(address, beds, baths, sqft);
    // const hotelData: any = [] //await hotels(city);
    const historicalRes = await historical({ address: address, city: city, stateCode: stateCode, zip: zip, lat: coords.lat, lng: coords.lng, beds, baths, sqft, resource: "airbnb" });
    const ordinance = ordinances(county, city);
    const poiData = await poi({ lat: coords.lat, lng: coords.lng });
    return res.status(200).json({
        ltr: ltrData,
        ordinance: {
            date: ordinance?.date,
            result: ordinance?.ordinance,
            location: ordinance?.location
        },
        hospitalDistance: poiData,
        historical: historicalRes
    })
}
