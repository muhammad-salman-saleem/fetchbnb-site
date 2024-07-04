import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { houseSearch } from '../../utils/str';

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

        if (!(bathrooms > 0)) {
            bathrooms = 1 //hard coded defaults
        }
        if (!(bedrooms > 0)) {
            bathrooms = 1 //hard coded defaults
        }
        const zip = parseInt(req.query.zip_code as string)
        const data = await houseSearch(city, address, state, zip, bedrooms, bathrooms);
        res.setHeader('Cache-Control', 's-maxage=604800');
        res.status(200).json(data)
    } catch (e) {
        res.status(500).json({ name: 'Internal Server Error', e })
        console.log('e')
    }
}
