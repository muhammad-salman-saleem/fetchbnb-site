// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import axios from 'axios';
import { Filters } from '../../shared/interfaces/Filters.d';
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

enum CoachingTag {
    GLAMPING,
    TREEHOUSE,
    NEWCONSTRUCTION,
    LUXURY,
}


type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        console.log("here")
        if (req.method !== 'GET') {
            return res.status(400).json({ name: 'Bad Request' })
        }
        let search = req.query?.search as string
        search = search.replace(/\s/g, ''); //remove spaces
        search = search.replace('/', ''); //remove slash
        const sort = req.query?.sort as string

        let coaches = [];
        console.log({ search })

        if (search.toUpperCase() === "ALL") {
            coaches = await prisma.coach.findMany({
                include: {
                    tags: true,
                    reviews: true,
                    images: true
                }
            })
        } else {
            coaches = await prisma.coach.findMany({
                where: {
                    tags: {
                        some: {
                            tag: {
                                equals: search.toUpperCase() as any | undefined //to get around enum, just using any
                            }
                        }
                    }
                },
                include: {
                    tags: true,
                    reviews: true,
                    images: true
                }
            })
        }

        return res.status(200).json({ coaches: coaches })
    } catch (error: any) {
        console.log("erro")
        res.setHeader('Cache-Control', 's-maxage=3600'); //revalidate cache every hour
        res.status(500).json({ error: error.message })
    }
}
