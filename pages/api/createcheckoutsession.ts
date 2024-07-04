import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()
//test
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log('RUNNINGAAA')
  if (req.method === 'POST') {
    console.log('RUNNING')
    const session: any = await unstable_getServerSession(req, res, authOptions as any)
    if (session) {
      const customerId = session.user.customerId
      const priceId = req.body.priceId
      console.log(priceId, 'priceId')
      const needsTrial = !!(req.body.needsTrial);
      const ref = req.body.ref
      console.log(customerId, priceId, 'INFO')
      try {
        // Create the subscription. Note we're expanding the Subscription's
        // latest invoice and that invoice's payment_intent
        // so we can pass it to the front end to confirm the payment
        if (process.env.Stripe === undefined) {
          return res.status(401).json({ error: "ERROR" });
        }
        const stripe = new Stripe(process.env.Stripe, { apiVersion: '2022-08-01' })

        const userLookUp: any = await prisma.user.findUnique({
          where: { id: session.user.id }
        })
        let customer = { id: userLookUp.customerId }
        console.log(userLookUp, 'userlookup')
        if (userLookUp.customerId === undefined || userLookUp.customerId === '' || userLookUp.customerId === null) {
          customer = await stripe.customers.create({})
        }
        const checkoutSessionOptions: any = {
          mode: 'subscription',
          customer: customer.id,

          line_items: [
            {
              price: priceId,
              // For metered billing, do not pass quantity
              quantity: 1
            }
          ],
          // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
          // the actual Session ID is returned in the query parameter when your customer
          // is redirected to the success page.
          success_url: process.env.URL as string + `success?session_id={CHECKOUT_SESSION_ID}&customerid=${customer.id}&priceid=${priceId}`,
          cancel_url: process.env.URL as string + 'canceled'
        }
        console.log("NEEDS TRIAL", needsTrial);
        // add trial period on all subscriptions
        if (true) {
          checkoutSessionOptions.subscription_data = { trial_period_days: 7 }
        }
        console.log(checkoutSessionOptions, 'checkoutSessionOptions')
        const stripeSession = await stripe.checkout.sessions.create(checkoutSessionOptions)
        console.log('Running --createcheckoutsession')
        console.log({ customerId, priceId })
        console.log({ stripeSession })
        console.log('Before Update --createcheckoutsession')

        // let reff = {}
        // if (ref !== undefined) {
        //   try {
        //     reff = await prisma.ref.findUnique({
        //       where: { refferal: ref }
        //     })
        //   } catch (e) {
        //     reff.id = ''
        //   }
        // }

        const user = await prisma.user.update({
          where: { id: session.user.id },
          data: {
            payment: {
              upsert: {
                update: {
                  customerId: stripeSession.customer?.toString(),
                  priceId
                },
                create: {
                  customerId: stripeSession.customer?.toString(),
                  priceId
                }
              }
            },
            customerId: stripeSession.customer?.toString()
          }
        }) //dont connect but update or something... you did this somewhere else

        // console.log({ user })
        // if (ref !== undefined && reff.id !== '') {
        //   await prisma.ref.update({
        //     where: { id: reff.id },
        //     data: {
        //       users: {
        //         connect: {
        //           id: user.id
        //         }
        //       }
        //     }
        //   })
        // }

        return res.status(303).json({
          url: stripeSession.url,
          stripeSession
        })
      } catch (error) {
        console.log(error)
        return res.status(400).send({ error: { message: "ERROR in CREATECHECKOUTSESSION" } })
      }
    } else {
      console.log('here')
      res.status(401)
      res.end()
    }
  }
}

//get id from stripeSession store in db, Then on webhook use the some stripe id to find them in the db and add a plan
