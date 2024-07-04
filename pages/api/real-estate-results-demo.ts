// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(400).json({ name: 'Bad Request' })
    }

    const state = req.query.state as string
    const city = req.query.city as string
    const filters: any = {
        minBed: parseInt(req.query.minBed as string),
        maxBed: parseInt(req.query.maxBed as string),
        minBath: parseInt(req.query.minBath as string),
        maxBath: parseInt(req.query.maxBath as string),
        investorType: req.query.investorType as string,
        propertyType: req.query.propertyType as string
    }
    const data: any = await realEstate(state, city, filters);
    res.setHeader('Cache-Control', 's-maxage=604800');
    res.status(200).json(data)
}
