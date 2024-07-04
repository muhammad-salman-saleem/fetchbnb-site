import Image from 'next/image'
import styles from '../styles/Signup.module.css';
import React, { FC, useState } from 'react'
import Layout from '../components/MainLayout'
import Navbar from '../components/MainNavbar'
import Link from 'next/link'
import PlausibleProvider from 'next-plausible';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import * as Yup from 'yup';
import { useRouter } from 'next/router';


//type Data = { csrfToken: any, providers: any }

export const getServerSideProps = async (ctx: any) => {
    let csrfToken: any = await getCsrfToken(ctx)
    const providers = await getProviders()
    if (csrfToken === undefined) {
        csrfToken = null
    }
    let x = {
        test: "test"
    }
    return {
        props: { data: { csrfToken, providers } }
    }
}


const Signup = ({ data }: any) => {
    // console.log(data)
    let csrfToken = data.csrfToken
    let providers = data.providers
    const router = useRouter();
    const [error, setError] = useState<any>(null);
    const [showError, setShowError] = useState({
        display: "none",
        message: ""
    });
    const [success, setSuccess] = useState("");
    const [email, setEmail] = useState("");

    const handleClick = async () => {
        if (email === "" || email === undefined) {
            setShowError({
                display: "block", message: "Please enter your email."
            })
            return null;
        }
        setShowError({ display: "none", message: "" })
        //send email
        const res = await fetch('/api/auth/createpassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email
            }),
        })
        const apiData = await res.json();
        if (apiData.error || res.status === 400) {
            setError(apiData.error)
            return null;
        }
        setSuccess(apiData.message);
    }


    return (
        <>
            <PlausibleProvider domain="fetchit.ai">
                <Navbar />
                <div className={styles.side__image}>
                    <Image src='/imgs/signupbg.png' alt='Woman next to modern home' width='930' height='833' style={{ position: "fixed", top: "calc(0 - 57px)", right: "0" }} />
                </div>
                <div style={{ height: "calc(100vh - 57px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div>
                        <Layout>
                            <h2 style={{ fontWeight: "600", fontSize: "20px", lineHeight: "24px" }}>Forgot Password</h2>
                            <p>To Continue enter your details</p>
                            <div>
                                <div
                                    className="bg-red-400 flex flex-col items-center 
            justify-center min-h-screen py-2 shadow-lg">
                                    <div>
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <span style={{ marginRight: "5px" }}>Your current account&apos;s email</span>
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    value={email}
                                                    type="text"
                                                    style={{
                                                        background: "#FFFFFF",
                                                        border: "1px solid #D7D7D7",
                                                        borderRadius: "5px",
                                                        padding: "5px 7px",
                                                        width: "100%",
                                                        maxWidth: "209px"
                                                    }} />
                                            </label>

                                        </div>
                                        <div style={{ display: showError.display, }}>
                                            <span style={{ color: "red", fontSize: "12px" }}>{showError.message}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={handleClick}
                                                type="submit"
                                                style={{ maxWidth: "210px", marginTop: "10px", width: "100%", backgroundColor: "black", color: "white", border: "none", borderRadius: "5px", height: "32px" }}
                                            >
                                                Reset Password
                                            </button>
                                        </div>
                                        <div style={{ display: (success === "" ? "none" : "block"), }}>
                                            <span style={{ color: "#00a808", fontSize: "12px" }}>{success}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Layout>
                    </div>
                </div>
            </PlausibleProvider>
        </>
    )
}

export default Signup