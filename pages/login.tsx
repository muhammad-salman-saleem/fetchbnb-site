import Image from 'next/image'
import styles from '../styles/Login.module.css';
import React, { FC, useState } from 'react'
import Layout from '../components/oldSite/Layout'
import MainNavbar from '../components/MainNavbar'
import Link from 'next/link'
import SmallText from '../components/oldSite/SmallText'
import PlausibleProvider from 'next-plausible';
import GoogleAds from '../components/oldSite/GoogleAds';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import MainLayout from '../components/MainLayout';


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
    const [rememberMe, setRememberMe] = useState(false);
    return (
        <>
            <GoogleAds />
            <PlausibleProvider domain="fetchit.ai">
                <div className={styles.wrapper}>
                    <section className={styles.container}>
                        <div className={styles.auth__side}>
                            <MainLayout>
                                <MainNavbar page="authpage" />
                                <div className={styles.main__container}>
                                    <h1 className={styles.title}>Welcome back</h1>
                                    <span className={styles.subtitle}>Welcome back! Please enter your details</span>
                                    <Formik
                                        initialValues={{ email: '', password: '' }}
                                        validationSchema={Yup.object({
                                            email: Yup.string()
                                                .email('Invalid email address')
                                                .required('Please enter your email'),
                                            password: Yup.string().required('Please enter your password'),
                                        })}
                                        onSubmit={async (values, { setSubmitting }) => {
                                            const res = await signIn('credentials', {
                                                redirect: false,
                                                email: values.email,
                                                password: values.password,
                                                callbackUrl: '/dashboard',
                                            });
                                            if (res?.error) {
                                                setError("Invalid email or password");
                                            } else {
                                                setError(null);
                                            }
                                            if (res?.url) router.push(res?.url);
                                            setSubmitting(false);
                                        }}
                                    >
                                        {(formik) => (
                                            <form onSubmit={formik.handleSubmit}>
                                                <div
                                                    className="bg-red-400 flex flex-col items-center 
            justify-center min-h-screen py-2 shadow-lg">
                                                    <div>
                                                        <input
                                                            name="csrfToken"
                                                            type="hidden"
                                                            defaultValue={csrfToken}
                                                        />

                                                        <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                                            {error}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label
                                                                htmlFor="email"
                                                                style={{ display: "flex", flexDirection: "column" }}
                                                            >
                                                                <Field
                                                                    name="email"
                                                                    aria-label="enter your email"
                                                                    aria-required="true"
                                                                    className={styles.input}
                                                                    type="text"
                                                                    placeholder="Email"
                                                                    style={{

                                                                        background: "#FFFFFF",
                                                                        border: "1px solid #E4E4F9",
                                                                        borderRadius: "12px",
                                                                        maxWidth: "370px",
                                                                        fontFamily: 'TT Interfaces',
                                                                        fontStyle: "normal",
                                                                        fontWeight: "500",
                                                                        fontSize: "18px",
                                                                        lineHeight: "140%",
                                                                        color: "#6B6B82",
                                                                        padding: "12px 16px",
                                                                        marginTop: "24px"
                                                                    }}
                                                                />
                                                            </label>

                                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                                <ErrorMessage name="email" />
                                                            </div>
                                                        </div>
                                                        <div className="mb-6">
                                                            <label
                                                                htmlFor="password"
                                                                style={{ display: "flex", flexDirection: "column" }}
                                                            >
                                                                <Field
                                                                    name="password"
                                                                    aria-label="enter your password"
                                                                    aria-required="true"
                                                                    placeholder="Password"
                                                                    className={styles.input}
                                                                    type="password"
                                                                    style={{

                                                                        background: "#FFFFFF",
                                                                        border: "1px solid #E4E4F9",
                                                                        borderRadius: "12px",
                                                                        maxWidth: "370px",
                                                                        fontFamily: 'TT Interfaces',
                                                                        fontStyle: "normal",
                                                                        fontWeight: "500",
                                                                        fontSize: "18px",
                                                                        lineHeight: "140%",
                                                                        color: "#6B6B82",
                                                                        padding: "12px 16px",
                                                                        marginTop: "16px"
                                                                    }}
                                                                />
                                                            </label>

                                                            <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                                                <ErrorMessage name="password" />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-center">
                                                            <div className={styles.auth__settings__container}>
                                                                <label className={styles.input__container}>
                                                                    <input onClick={() => setRememberMe(prev => !prev)} type="checkbox" checked={rememberMe} />
                                                                    <span className={styles.checkmark}></span>
                                                                    <span className={styles.checkbox__font}>Remember me</span>
                                                                </label>
                                                                <Link className={styles.forgotpassword} href='/createpassword'>Forgot password?</Link>
                                                            </div>
                                                            <button
                                                                type="submit"
                                                                style={{
                                                                    border: "none",
                                                                    width: "370px",
                                                                    height: "48px",
                                                                    fontFamily: 'TT Interfaces',
                                                                    fontStyle: "normal",
                                                                    fontWeight: "600",
                                                                    fontSize: "18px",
                                                                    lineHeight: "140%",
                                                                    color: "#FFFFFF",
                                                                    background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                                                                    borderRadius: "8px",
                                                                    marginTop: "16px"
                                                                }}
                                                            >
                                                                {formik.isSubmitting ? 'Please wait...' : 'Login'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                    <div className={styles.divider}>
                                        <div className={styles.hr} />
                                        <span>Or</span>
                                        <div className={styles.hr} />
                                    </div>
                                    <div className={styles.auth__providers}>
                                        <button onClick={() => signIn("google")} ><Image src='/imgs/google_login.svg' alt='' width='41' height='41' /></button>
                                        {/* <button><Image src='/imgs/facebook_login.svg' alt='' width='41' height='41' /></button> */}
                                        {/* <button><Image src='/imgs/apple_login.svg' alt='' width='41' height='41' /></button> */}
                                        {/* <button><Image src='/imgs/twitter_logo.svg' alt='' width='41' height='41' /></button> */}
                                    </div>
                                </div>
                            </MainLayout>
                        </div>
                        <div className={styles.map__side}>
                            <Image src='/imgs/logincard.svg' width='374' height='319' alt='' />
                            <Image src='/imgs/logindots.svg' width='62' height='8' alt='' />
                            <h4 className={styles.map__title}>Short-Term Rental Predictions</h4>
                            <span className={styles.map__subtitle}>Say goodbye to confusion and hello to profits with our LIVE short term rental predictions for for-sale listings.</span>
                        </div>
                    </section>
                    <span className={styles.altauth}>Don`t have an account? <Link className={styles.altlink} href='/signup'>Sign Up</Link></span>
                </div>
            </PlausibleProvider>
        </>
    )
}

export default Signup