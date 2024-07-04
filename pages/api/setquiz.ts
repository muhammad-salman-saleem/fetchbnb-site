// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { hotels } from '../../utils/hotels'
import { ltr } from '../../utils/ltr'
import ordinances from '../../utils/ordinances'
import poi from '../../utils/poi';
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


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

        /* Example: 
           {
                phone: 3465346,
                zip: '70447',
                gender: 'male',
                description: 'ltr',
                propertyLocations: [ 'miami' ]
            } 
         */

        if (req.body?.gender) {
            const phone = String(req.body?.phone);
            const zip = req.body?.zip;
            const gender = String(req.body?.gender).toUpperCase();
            const description = req.body?.description;
            const airbnbProfileLink = req.body?.airbnbProfileLink;
            const propertyLocations: string[] | undefined = req.body?.propertyLocations;

            //update property locations
            if (propertyLocations) {
                propertyLocations.forEach(async (location) => {
                    await prisma.user.upsert({
                        where: {
                            id: session.user.id
                        },
                        update: {
                            propertyLocations: {
                                create: {
                                    location
                                }
                            }
                        },
                        create: {
                            propertyLocations: {
                                create: {
                                    location
                                }
                            }
                        }
                    })
                })
            }

            const updatePromises = [];

            //update phone
            updatePromises.push(prisma.user.upsert({
                where: {
                    id: session.user.id
                },
                update: {
                    phone
                },
                create: {
                    phone
                }
            }))
            //update zip
            updatePromises.push(prisma.user.upsert({
                where: {
                    id: session.user.id
                },
                update: {
                    zip
                },
                create: {
                    zip
                }
            }))
            //update gender
            updatePromises.push(prisma.user.upsert({
                where: {
                    id: session.user.id
                },
                update: {
                    gender: gender as any
                },
                create: {
                    gender: gender as any
                }
            }))
            updatePromises.push(prisma.user.upsert({
                where: {
                    id: session.user.id
                },
                update: {
                    investmentDescription: description,
                    airbnbProfileLink: airbnbProfileLink,
                },
                create: {
                    investmentDescription: description,
                    airbnbProfileLink: airbnbProfileLink
                }
            }))

            await Promise.all(updatePromises);
        }
        res.status(200).json({ state: 'done' })

    } catch (error) {
        console.log(error);
        console.log("Error in setquiz.ts catch block")
    }
}
