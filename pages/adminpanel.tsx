import React, { useState, useEffect } from 'react'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import Navbar from '../components/MainNavbar'
import Layout from '../components/MainLayout'
import styles from '../styles/Pricing.module.css'
import Footer from '../components/MainFooter'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Cookies from 'universal-cookie'
import PlausibleProvider from 'next-plausible'
import * as fbq from '../lib/fpixel';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Password = {
    email: string,
    password: string
} | {}

export async function getServerSideProps(context: any) {
    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user = session?.user
    if (user === undefined) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }
    if (user?.role !== "ADMIN") {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            password: true,
            passwordUpdateCode: true,
            requestedZonings: true,
            communityOrdInfos: true
        }
    })

    return {
        props: { session, users },
    }
}


const Adminpanel: React.FC<{ users: any }> = ({ users }) => {
    const { data: session } = useSession()
    const [password, setPassword] = useState<any>({});
    const [newEmail, setNewEmail] = useState("");
    const [isNewAccountDone, setIsNewAccountDone] = useState(false);

    const handleActivation = async (email: string) => {
        const res = await fetch(`/api/admin/activate?email=${email}&apiKey=${"ijuhgyhbnmjiu8736trefgbsh8"}`)
        const data = res.json();
    }

    const handlePasswordChange = async (email: string, newVal: string) => {
        setPassword((prev: any) => ({ ...prev, [email]: newVal }))
        console.log(password)
    }

    const handlePasswordSubmit = async (email: string) => {
        const res = await fetch(`/api/admin/newpassword?email=${email}&password=${password[email]}&apiKey=${"ijuhgyhbnmjiu8736trefgbsh8"}`)
        const data = res.json();
    }

    const submitNewAccount = async () => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: newEmail,
                password: "fetchitwins1",
                name: "Human"
            }),
        }
        const response = await fetch('/api/auth/signup', options);
        const data = await response.json();

        handleActivation(newEmail);
        setNewEmail("");
        setIsNewAccountDone(true);
    }

    return (
        <>
            <PlausibleProvider domain="fetchit.ai">
                <section>
                    <Navbar />
                    <Layout >
                        <h1 style={{ fontWeight: '500', marginTop: "30px", marginBottom: "50px" }}>Admin Panel</h1>
                        <div>
                            <h1>Create Free Account</h1>
                            <p>Use this form to create a free account for a user.</p>
                            <div>
                                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="text" placeholder='email' />
                                <button onClick={submitNewAccount}>Create</button>
                                {isNewAccountDone ? <p style={{ color: "green" }}>Done! The password is fetchitwins1</p> : <></>}
                            </div>
                            <hr />
                        </div>
                        <p style={{ marginTop: "50px", }}>All users</p>
                        <div>
                            <table style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Controls</th>
                                        <th>Email</th>
                                        <th>Has Password</th>
                                        <th>Requests</th>
                                        <th>Community Ords</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.map((user: any, index: number) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                    <td style={{ borderBottom: "1px solid grey" }}>
                                                        <div>
                                                            <button onClick={() => handleActivation(user.email)} style={{ border: "none", borderRadius: "5px", padding: "5px 10px", background: "black", color: "white" }}>Activate Account</button>
                                                            <div style={{ display: "flex" }}>
                                                                <input type="text" placeholder='New Password' value={password[user.email]} onChange={(e) => handlePasswordChange(user.email, e.target.value)} />
                                                                <button onClick={() => handlePasswordSubmit(user.email)} style={{ border: "none", borderRadius: "5px", padding: "5px 10px", background: "black", color: "white" }}>Submit</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ borderBottom: "1px solid grey" }}><span style={{ marginRight: "20px" }}>{index + 1}</span> {user.email}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{(user?.password !== null && user?.password !== undefined && user?.password !== "null") ? "User has password" : "User has NO password"}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{user?.requestedZonings?.map((zoning: any) => `state: ${zoning?.state}, ${zoning?.county}, `)}</td>
                                                    <td style={{ borderBottom: "1px solid grey" }}>{user?.communityOrdInfos?.map((zoning: any) => `state: ${zoning?.state}, ${zoning?.county}, info: ${zoning.info},`)}</td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Layout>
                    <Footer />
                </section>
            </PlausibleProvider>
        </>
    )
}

export default Adminpanel;