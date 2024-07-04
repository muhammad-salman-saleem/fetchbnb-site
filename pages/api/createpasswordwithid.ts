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
        if (!req.body) return res.status(404).json({ message: "No form data" })
        const { password, passwordId } = req.body


        //check duplicate user
        const checkExisting = await prisma.user.findFirst({
            where: {
                passwordUpdateCode: passwordId
            }
        })
        if (!checkExisting) return res.status(400).json({ message: "Invalid id" });
        if (checkExisting.passwordUpdateCode === null || checkExisting.passwordUpdateCode === "" || checkExisting.passwordUpdateCode === undefined) return res.status(400).json({ status: 400, message: "Invalid id" });
        const userToUpdate = await prisma.user.findFirst({
            where: {
                passwordUpdateCode: passwordId
            },
        })
        if (!userToUpdate) return res.status(400).json({ message: "Invalid id" });
        console.log(userToUpdate, "userToUpdate")
        if(userToUpdate?.id === undefined) return res.status(400).json({ message: "Invalid id" });
        const newPassword = await hash(password, 12);
        console.log(newPassword, "newpass")
        let updateUser = await prisma.user.update({
            where: {
                id: userToUpdate.id
            },
            data: {
                passwordUpdateCode: null,
                password: newPassword,
            },
        })

        const msg = {
            to: updateUser.email as string, // Change to your recipient
            from: 'support@fetchit.ai', // Change to your verified sender
            subject: 'Fetchit.Ai | Your Password has been updated',
            text: 'Fetchit.ai | Your password has been updated',
            html: '<div><p>Fetchit.ai | Your password has been updated!</p> If this was an error, please reply.</div>',
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


        // await prisma.user.update({
        //     where: {
        //         email
        //     },
        //     data: {
        //         password: await hash(password, 12),
        //     }
        // })

        res.status(201).json({ status: true, message: "New Password Added!, redirecting to login page..." })

    }
    catch (e) {
        console.log(e, "error in createpasswordwithid.ts")
        res.status(404).json({ error: e, message: e })
    }
}
