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

const Signup = ({ data }: any) => {
    // console.log(data)
    const router = useRouter();
    const [error, setError] = useState<any>(null);
    const [showError, setShowError] = useState({
        display: "none",
        message: ""
    });
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleClick = async () => {
        if (password !== cPassword || password === "" || password.length <= 3) {
            return setShowError({
                display: "block", message: "Passwords do not match or are too short."
            })
        }


        setShowError({ display: "none", message: "" })
        //send email
        const passwordId = router.query.id;
        const res = await fetch('/api/createpasswordwithid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: password,
                passwordId
            }),
        })
        const data = await res.json();
        setMessage(data.message);
        setTimeout(() => {
            router.push("/login");
        }
            , 3000)
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
                            <h2 style={{ fontWeight: "600", fontSize: "20px", lineHeight: "24px" }}>Create your password</h2>
                            <p>To continue enter your new password</p>
                            <div>
                                <div
                                    className="bg-red-400 flex flex-col items-center 
            justify-center min-h-screen py-2 shadow-lg">
                                    <div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <span style={{ marginRight: "5px" }}>Password</span>
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    type="password"
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
                                        <div className="mb-6">
                                            <label
                                                htmlFor="password"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <span style={{ marginRight: "5px" }}>Confirm Password</span>
                                                <input
                                                    type="password"
                                                    onChange={(e) => setCPassword(e.target.value)}
                                                    value={cPassword}
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
                                                Create Password
                                            </button>
                                        </div>
                                        <div style={{ display: (message === "" ? "none" : "block"), }}>
                                            <span style={{ color: "black", fontSize: "12px" }}>{message}</span>
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