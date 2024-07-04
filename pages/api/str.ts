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
    try {
        if (req.method !== 'GET') {
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
        const propertyId = (`${address.replace(/\s/g, '')}${city.replace(/\s/g, '')}${state.replace(/\s/g, '')}${zip}${bedrooms}${bathrooms}`);

        //check if response is in db
        const response = await prisma.mashvisorResponse.findUnique({
            where: {
                propertyId: propertyId
            },
            include: {
                mashvisorStatus: {
                    include: {
                        mashvisorContent: {
                            include: {
                                expenses_map: true
                            }
                        }
                    }
                }
            }
        })
        if (response) {
            const data = { fromCache: true, status: response?.mashvisorStatus?.status, content: { ...response?.mashvisorStatus?.mashvisorContent, expenses_map: response?.mashvisorStatus?.mashvisorContent?.expenses_map } }
            res.setHeader('Cache-Control', 's-maxage=604800');
            return res.status(200).json(data)
        }

        const data = await houseSearch(city, address, state, zip, bedrooms, bathrooms);
        console.log(data.content.cap_rate)

        //insert response into db
        await prisma.mashvisorResponse.upsert({
            where: {
                propertyId: propertyId
            },
            create: {
                propertyId: propertyId,
                mashvisorStatus: {
                    create: {
                        status: data.status,
                        mashvisorContent: {
                            create: {
                                adjusted_rental_income: data.content.adjusted_rental_income,
                                cap_rate: data.content.cap_rate,
                                cash_on_cash: data.content.cash_on_cash,
                                cash_flow: data.content.cash_flow,
                                expenses: data.content.expenses,
                                market: data.content.market,
                                median_home_value: data.content.median_home_value,
                                median_night_rate: data.content.median_night_rate,
                                median_occupancy_rate: data.content.median_occupancy_rate,
                                median_rental_income: data.content.median_rental_income,
                                price_to_rent_ratio: data.content.price_to_rent_ratio,
                                principle_with_interest: data.content.principle_with_interest,
                                sample_size: data.content.sample_size,
                                tax_rate: data.content.tax_rate,
                                expenses_map: {
                                    create: {
                                        cleaningFees: data.content.expenses_map.cleaningFees,
                                        hoa_dues: data.content.expenses_map.hoa_dues,
                                        insurance: data.content.expenses_map.insurance,
                                        maintenace: data.content.expenses_map.maintenace,
                                        management: data.content.expenses_map.management,
                                        propertyTax: data.content.expenses_map.propertyTax,
                                        utilities: data.content.expenses_map.utilities,
                                        rentalIncomeTax: data.content.expenses_map.rentalIncomeTax,
                                    }
                                }
                            }
                        }
                    }
                }
            },
            update: {
                propertyId: propertyId,
                mashvisorStatus: {
                    create: {
                        status: data.status,
                        mashvisorContent: {
                            create: {
                                adjusted_rental_income: data.content.adjusted_rental_income,
                                cap_rate: data.content.cap_rate,
                                cash_on_cash: data.content.cash_on_cash,
                                cash_flow: data.content.cash_flow,
                                expenses: data.content.expenses,
                                market: data.content.market,
                                median_home_value: data.content.median_home_value,
                                median_night_rate: data.content.median_night_rate,
                                median_occupancy_rate: data.content.median_occupancy_rate,
                                median_rental_income: data.content.median_rental_income,
                                price_to_rent_ratio: data.content.price_to_rent_ratio,
                                principle_with_interest: data.content.principle_with_interest,
                                sample_size: data.content.sample_size,
                                tax_rate: data.content.tax_rate,
                                expenses_map: {
                                    create: {
                                        cleaningFees: data.content.expenses_map.cleaningFees,
                                        hoa_dues: data.content.expenses_map.hoa_dues,
                                        insurance: data.content.expenses_map.insurance,
                                        maintenace: data.content.expenses_map.maintenace,
                                        management: data.content.expenses_map.management,
                                        propertyTax: data.content.expenses_map.propertyTax,
                                        utilities: data.content.expenses_map.utilities,
                                        rentalIncomeTax: data.content.expenses_map.rentalIncomeTax,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        res.setHeader('Cache-Control', 's-maxage=604800');

        res.status(200).json(data)
    } catch (e) {
        res.status(500).json({ name: 'Internal Server Error', e })
        console.log('e')
    }
}
