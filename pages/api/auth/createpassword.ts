import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import sgMail from '@sendgrid/mail'
import crypto from 'crypto';
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

type Data = any

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
//city, zip_code, adddress, bedrooms, bathrooms, state
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(400).json({ name: 'Bad Request' })
    }
    try {
        if (!req.body) return res.status(404).json({ error: "No form data" })
        const { email } = req.body

        //check duplicate user
        const checkExisting = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!checkExisting) return res.status(400).json({ error: "No user found" });
        let passwordId = crypto.randomBytes(64).toString('hex');

        console.log(checkExisting)
        if (checkExisting.passwordUpdateCode !== null && checkExisting.passwordUpdateCode !== "" && checkExisting.passwordUpdateCode !== undefined) {
            console.log('Using exising id')
            passwordId = checkExisting.passwordUpdateCode as string;
        } else {
            console.log('creating new id')
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    passwordUpdateCode: passwordId
                }
            })
        }

        const msg = {
            to: email, // Change to your recipient
            from: 'support@fetchit.ai', // Change to your verified sender
            subject: 'Fetchit.Ai | Create your password',
            text: `https://fetchit.ai/updatepassword?id=${passwordId}`,
            html: `<div><p>Fetchit.ai | Create your passsword!</p><p><a href="https://fetchit.ai/updatepassword?id=${passwordId}" style="background-color: black; color: white; padding: 15px; text-decoration: none; border-radius: 5px; margin-bottom: 50px">Create Password</a></p><strong>DO NOT SHARE THIS LINK. </strong><p>If this was not meant for you, please ignore.</p></div>`,
        }

        sgMail
            .send(msg)
            .then((response) => {
                console.log(response[0].statusCode, "email")
            })
            .catch((error) => {
                res.json({ error })
                console.error(error)
            })


        // await prisma.user.update({
        //     where: {
        //         email
        //     },
        //     data: {
        //         password: await hash(password, 12),
        //     }
        // })

        res.status(201).json({ status: true, message: "Email sent! to " + email })

    }
    catch (e) {
        console.log(e)
        res.status(404).json({ error: e })
    }
}
