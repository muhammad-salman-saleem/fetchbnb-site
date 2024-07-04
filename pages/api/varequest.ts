// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import axios from "axios";
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    const session: any = await unstable_getServerSession(req, res, authOptions as any)

    let userEmail = session?.user?.email;
    if (!userEmail) userEmail = "USER THAT IS NOT SIGNED UP TO FETCHIT.AI"

    const selectedItems = req.body.selectedItems as string[];


    const msg = {
        to: ["kohlbyrdvlogs@gmail.com", "andrea@workwithposeidon.com", "yonatanwaxman@fetchit.ai"], // Change to your recipient
        from: 'support@fetchit.ai', // Change to your verified sender
        subject: 'Fetchit.ai | User VA Request',
        text: 'Fetchit.ai | User VA Request',
        html: `
        <div align="center">
            <h1>Fetchit.ai | User VA Request</h1>
            <p><b>${userEmail}</b> clicked through to your calendly. There is a chance the user left the Calendly page without setting up a time.</p>
            <p>The user is interested in the following options:</p>
            ${selectedItems.map((option) => {
            return `<p>${option}</p>`
        })
            }
            <p>Thank you. Do not reply to this email. Talk to Yonatan for help.</p>
            <p>For technical questions talk to: me@kohlbyrd.com</p>
        </div>
        `,
    }

    sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })


    res.status(200).json({ status: "done" });
}
