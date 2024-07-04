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
    if (req.method !== 'POST') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    const session: any = await unstable_getServerSession(req, res, authOptions as any)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const county = req.body.county
        const state = req.body.state
        const x = await prisma.user.upsert({
            where: {
                id: session.user.id
            },
            update: {
                requestedZonings: {
                    create: {
                        state: state.toString(),
                        county: county.toString()
                    }
                }
            },
            create: {
                requestedZonings: {
                    create: {
                        state: state.toString(),
                        county: county.toString()
                    }
                }
            }
        })
        console.log(x, "winner")
        return res.status(200).json({ msg: "complete" })
    } catch (e) {
        console.log(e, "error in requestZoning endpoint");
        console.log(session.user)
        res.status(500).json({ error: 'Internal Server Error', e })
        console.log('e')
    }
}
