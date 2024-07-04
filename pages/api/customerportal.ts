import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from "next"
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const prisma = new PrismaClient()


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        if (req.method === 'POST') {
            if (process.env.Stripe === undefined) {
                return res.status(401).json({ error: "ERROR" });
            }
            const stripe = new Stripe(process.env.Stripe, { apiVersion: '2022-08-01' })
            const session: any = await unstable_getServerSession(req, res, authOptions as any)
            if (session) {
                const returnUrl = 'https://www.fetchit.ai/profile';
                const customerId = session?.user?.customerId;
                if (customerId === undefined || customerId === '' || customerId === null) {
                    const userEmailMsg = {
                        to: session.user.email, // Change to your recipient
                        from: 'support@fetchit.ai', // Change to your verified sender
                        subject: 'Fetchit.ai | Support Ticket, automated email',
                        text: 'Fetchit.ai | Support Ticket, automated email',
                        html: `
                        <div align="center">
                            <h1>Fetchit.ai | Support Ticket</h1>
                            <p>Dear Fetchit customer,</p>
                            <p>We apologize for the inconvenience. You will recieve an email from support within 24 hours to help you manage your account, cancel your plan, or adjust your billing settings.</p>
                            <p>This is an automated message.</p>
                            <p><b>Do not reply</b> this email thread will not be replied to.</p>
                            <p>For technical questions (bug reports etc.) email: me@kohlbyrd.com</p>
                            <p>Thank you, this will be resolved shortly.</p>
                        </div>
                        `,
                    }
                    const yonatanEmailMsg = {
                        to: ["kohlbyrdvlogs@gmail.com", "yonatanwaxman@fetchit.ai"], // Change to your recipient
                        from: 'support@fetchit.ai', // Change to your verified sender
                        subject: 'Fetchit.ai | URGENT BILLING SUPPORT NEEDED',
                        text: 'Fetchit.ai | URGENT BILLING SUPPORT NEEDED',
                        html: `
                        <div align="center">
                            <h1>Fetchit.ai | User needs support with billing</h1>
                            <p>Dear Fetchit support,</p>
                            <p>The user with the email <b>${session.user.email}</b> cannot access the manage billing page</p>
                            <p>This most likely means that they want to cancel their Fetchit subscription</p>
                            <p>Please email <b>${session.user.email}</b> within 24 hours and assist them.</p>
                            <br></br>
                            <p>Do not reply to this email, this is automated.</p>
                        </div>
                        `,
                    }


                    try {
                        await sgMail.send(userEmailMsg)
                        await sgMail.send(yonatanEmailMsg)
                    }
                    catch (error) {
                        return res.status(401).json({ error: "Email sent to support to help you manage your account. You will get a reply back in 24 hours. Sorry if this causes you any trouble." });
                    }
                    return res.status(401).json({ error: "Email sent to support to help you manage your account. You will get a reply back in 24 hours. Sorry if this causes you any trouble." });
                }

                const userPayment = await prisma.userPayment.findUnique({
                    where: {
                        userId: session.user.id
                    }
                })
                const portalSession = await stripe.billingPortal.sessions.create({
                    customer: customerId,
                    return_url: returnUrl,
                });
                return res.status(301).json({ url: portalSession.url });
            }

        }
        return res.status(401).json({ error: "ERROR" });
    }
    catch (error) {
        return res.status(401).json({ error });
    }
}