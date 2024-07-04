// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
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
    try {
        if (req.method !== 'GET') return res.status(400).json({ name: 'Bad Request' })
        const session: any = await unstable_getServerSession(req, res, authOptions as any)
        if (!session) return res.status(401).json({ error: 'Unauthorized' })
        //auth
        if (session?.user?.role !== "ADMIN") return res.status(403).json({ error: 'Forbidden, incorrect role for task.' });
        if (req?.query?.apiKey !== "ijuhgyhbnmjiu8736trefgbsh8") return res.status(403).json({ error: 'Forbidden, incorrect apiKey for task.' });

        const email = req?.query?.email as string;
        if (!email) return res.status(400).json({ error: 'Bad Request, no email provided.' });

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                plan: "BOTH"
            }
        })

        res.status(200).json({ msg: "completed." })
    } catch (error) {
        console.log(error);
    }
}
