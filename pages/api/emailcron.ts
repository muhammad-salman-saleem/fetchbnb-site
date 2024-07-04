// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { realEstate } from '../../utils/realEstate';
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import axios from 'axios';
import { Filters } from '../../shared/interfaces/Filters.d';
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const prisma = new PrismaClient()

type Data = any

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {

        if (req.method !== 'GET') {
            return res.status(400).json({ name: 'Bad Request' })
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { didReceiveAbandonedNotification: false },
                    { plan: "UNPAID" },
                    {
                        joinDate: {
                            gte: new Date('2023-04-3').toISOString() //any user past this date will be notified
                        }
                    }
                ]
            }
        })

        if (users && users?.length !== 0 && users?.length !== undefined) {
            let usersWithPhoneNumbers: any = [];
            let usersWithoutPhoneNumbers: any = [];
            users.forEach((user) => {
                if (user?.phone && user?.phone !== "") {
                    usersWithPhoneNumbers.push(user)
                    usersWithoutPhoneNumbers.push(user);
                } else if (user?.email) {
                    usersWithoutPhoneNumbers.push(user);
                }
            })

            if (usersWithPhoneNumbers.length !== 0) {
                usersWithPhoneNumbers.forEach((user: any) => {
                    let message = client.messages.create({
                        body: `Yonatan, the founder of Fetchit, here! Noticed you tried signing up this week.\n\nI'd love to chat with you personally about what you're looking for in our product.\n\nI can even give you a free month of our software to try it out for yourself.\n\nFree for a quick call tomorrow? I'll demo you the product myself.\n\nFree for a quick call tomorrow? I'll demo you the product myself.`,
                        from: '+18444698806',
                        to: "+1" + user?.phone
                    }).then((message: any) => console.log(message.sid))
                });
            }

            for (let i = 0; i < usersWithoutPhoneNumbers.length; i++) {
                const user = users[i];
                const email = user?.email;
                if (email) {
                    const msg = {
                        to: email.toLowerCase(), // Change to your recipient
                        from: 'yonatanwaxman@fetchit.ai', // Change to your verified sender
                        subject: 'Yonatan here, you forgot something!',
                        text: 'Yonatan here, you forgot something!',
                        html: `
                            <div style="font-family:Calibri,Arial,Helvetica,sans-serif;font-size:12pt;color:rgb(0,0,0);background-color:rgb(255,255,255)">
                            <div>Hey there!<br>
                            </div>
                            <div><br>
                            </div>
                            <div>Yonatan, the founder of Fetchit, here! I noticed that you left something behind in your cart, and I just wanted to reach out and make sure everything is okay.</div>
                            <div><br>
                            </div>
                            <div>Was it something we said? Did we forget to add your favorite feature? Or maybe it was the price tag? Whatever it was, I'm sure we can work something out.</div>
                            <div><br>
                            </div>
                            <div>In fact, <i>I'd love to chat with you personally</i> about what you're looking for in our product.&nbsp;</div>
                            <div><br>
                            </div>
                            <div><span style="display:inline!important;background-color:rgb(255,255,255)">Don't worry, I won't bite (unless you're made of chocolate, of course!). Just hit reply and let me know when works
                            for you. Looking forward to hearing back from you soon!</span><br>
                            </div>
                            <div><br>
                            </div>
                            <div>I can even give you a <span style="background-color:rgb(255,255,0)">
                            <b><u>free month of our software </u></b></span>to try it out for yourself. Let's schedule a
                            <a href="https://calendly.com/yonatanwaxman/30min?back=1&amp;month=2023-04" title="https://calendly.com/yonatanwaxman/30min?back=1&amp;month=2023-04" id="m_-3318308357227167LPNoLPOWALinkPreview" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://calendly.com/yonatanwaxman/30min?back%3D1%26month%3D2023-04&amp;source=gmail&amp;ust=1680578154156000&amp;usg=AOvVaw2tWS3mGt4aT3KY1EDFFfHl">
                            quick call at your convenience</a>, and I'll give you a demo of our amazing features.</div>
                            <div>
                            </div>
                            <div><br>
                            </div>
                            <div>Best,</div>
                            Yonatan Waxman, Fetchit Founder<div class="yj6qo"></div><div class="adL"><br>
                            </div></div>
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
                }
            }

            for await (const user of users) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        didReceiveAbandonedNotification: true
                    }
                })
            }
        }

        return res.status(200).end(JSON.stringify({ users }))
    } catch (error: any) {
        console.log("ERROR FROM EMAIL CRON")
        console.log(error)
        return res.status(500).end(JSON.stringify({ msg: 'Error in CRON', error }))
    }
}