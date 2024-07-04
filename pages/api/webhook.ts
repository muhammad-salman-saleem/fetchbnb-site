import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
// import customRef from '../../utils/customRef'
const prisma = new PrismaClient()

export const config = {
  api: {
    bodyParser: false
  }
}

const getPlan = (priceId: string) => {
  console.log("GETPLAN RUNNING")
  console.log(priceId, "PRICEID")
  switch (priceId) {
    case process.env.NEXT_PUBLIC_STRIPE_PRODUCT_1:
      return 'ZONING'
    case process.env.NEXT_PUBLIC_STRIPE_PRODUCT_2:
      return 'RENTAL'
    case process.env.NEXT_PUBLIC_STRIPE_PRODUCT_3:
      return 'BUYING'
    case process.env.NEXT_PUBLIC_STRIPE_PRODUCT_4:
      return 'BOTH'
    case process.env.NEXT_PUBLIC_STRIPE_PRODUCT_5:
      return 'BOTH'
  }
  return 'BOTH'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log('WEBHOOK ACTIVE!')
  console.log('RUNNINGAAA WEBHOOK')
  if (req.method === 'POST') {
    if (process.env.Stripe === undefined) {
      return res.status(401).json({ error: "ERROR" });
    }
    const stripe = new Stripe(process.env.Stripe, { apiVersion: '2022-08-01' })
    let data
    let eventType
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WHS as string;
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event
      const rawBody = await buffer(req)
      let signature = req.headers['stripe-signature']
      if (signature === undefined) {
        console.log('NO SIGNATURE, so overwriting with empty string, webhook.ts line 53');
        signature = ''
      }
      try {
        event = stripe.webhooks.constructEvent(
          rawBody.toString(),
          signature,
          webhookSecret
        )
      } catch (err) {
        console.log(err)
        console.log(`⚠️  Webhook signature verification failed.`)
        return res.status(400)
      }
      // Extract the object from the event.
      data = event.data
      eventType = event.type
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data
      eventType = req.body.type
    }

    //console.log(data, 'ADATATA')

    let userPayment: any = await prisma.userPayment.findFirst({
      where: {
        customerId: data.object.customer
      }
    })

    console.log(eventType, 'EVENT TYPE')

    switch (eventType) {
      case 'checkout.session.completed':
        console.log(data, 'DATA CYS')

        console.log(userPayment, 'USER PAYMENT')

       
        const x = await prisma.user.update({
          where: {
            id: userPayment?.userId
          },
          data: {
            plan: getPlan(userPayment?.priceId)
          }
        })


        // Payment is successful and the subscription is created.
        // You should provision the subscription and save the customer ID to your database.
        break
      case 'customer.subscription.deleted':
        console.log('subscription deleted')

        await prisma.user.update({
          where: {
            id: userPayment.userId
          },
          data: {
            plan: 'UNPAID'
          }
        })

        break
      case 'invoice.paid':
        await prisma.user.update({
          where: {
            id: userPayment.userId
          },
          data: {
            plan: getPlan(userPayment?.priceId)
          }
        })

        // const user = await prisma.user.findUnique({
        //   where: { id: userPayment.userId },
        //   include: {
        //     ref: true
        //   }
        // })

        // //grab commisionAmount, eventually this can be dynamic based on the refferal used
        // let commisionAmount = 0
        // let plan = getPlan(userPayment.priceId)
        // commisionAmount = customRef(plan, user.ref)

        // const topup = await stripe.topups.create({
        //   amount: commisionAmount,
        //   currency: 'usd',
        //   description: 'Commision',
        //   statement_descriptor: `${plan}`
        // })

        // const transfer = await stripe.transfers.create({
        //   amount: commisionAmount,
        //   currency: 'usd',
        //   destination: user.ref.accountId
        // })

        // console.log(topup, 'topup')
        // console.log(transfer, 'transfer')

        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break
      case 'invoice.finalized':
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        await prisma.user.update({
          where: {
            id: userPayment.userId
          },
          data: {
            plan: 'UNPAID'
          }
        })
        break
      case 'customer.subscription.updated':
        console.log(data)

        console.log('updating')
        const test = await prisma.user.update({
          where: {
            id: userPayment.userId
          },
          data: {
            plan: getPlan(data.object.plan.id)
          }
        })
        console.log(test, 'test')

        break
      default:
      // Unhandled event type
    }
    return res.status(200).json({ received: true })
  }
  return res.status(401).json({ error: "ERROR" })
}
