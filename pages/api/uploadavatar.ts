// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { hotels } from '../../utils/hotels'
import { ltr } from '../../utils/ltr'
import ordinances from '../../utils/ordinances'
import poi from '../../utils/poi';
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method !== 'POST') {
            return res.status(400).json({ name: 'Bad Request' })
        }
        const session: any = await unstable_getServerSession(req, res, authOptions as any)
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        //continue code here

        return res.status(200).json({ status: "done" });
    }
    catch (error) {
        console.error(error);
    }
}
