// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Data = any
//testy
const freeUsers = [
    'hjroche86@gmail.com',
    '94amejia@gmail.com',
    'eklundkatie@gmail.com',
    'chadgourley1@gmail.com',
    'turnerfallsllc@gmail.com',
    'capoferricustoms@gmail.com',
    'cory.rovens@gmail.com',
    'hollandproperty2022@gmail.com',
    'albertojoseolivo@gmail.com',
    'woodburnassets@gmail.com',
    'jnnyberg@hotmail.com',
    'bigcountrypm@gmail.com',
    'joel.felicio75@gmail.com',
    'davidrosenbeckrei@gmail.com',
    'amandawelsh9@aol.com',
    'lesvoyagesdemma@gmail.com',
    'tiffanyaverna@gmail.com',
    'greynoldsr@yahoo.com',
    'kamamalon@gmail.com',
    'anuj.sheth+realestate@gmail.com',
    'vividrealtysb@gmail.com',
    'doecette@gmail.com',
    'is_tave@duck.com',
    'eudora@moonrise-homes.com',
    'nicoletaylornct@gmail.com',
    'lwaxman@waxman.com',
    'bwaxman@waxman.com'
]

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.setHeader('Cache-Control', 's-maxage=172800');
    if (req.method !== 'GET') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    const session: any = await unstable_getServerSession(req, res, authOptions as any)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    if (session?.user?.plan !== "UNPAID") {
        return res.status(403).json({ error: 'Forbidden, incorrect plan for task.' })
    }

    if (!freeUsers.includes(session?.user?.email.toLowerCase())) return res.status(403).json({ error: 'Forbidden, incorrect plan for task.' });

        await prisma.user.update({
            where: {
                id: session?.user?.id
            },
            data: {
                plan: "BOTH"
            }
        })

    res.status(200).json({ msg: "completed." })
}
