import React, { useState, useEffect } from 'react'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import MainNavbar from '../components/MainNavbar'
import Layout from '../components/oldSite/Layout'
import styles from '../styles/Pricing.module.css'
import { PriceCards } from '../components/oldSite/PriceCards'
import { FaqSection } from '../components/oldSite/FaqSection'
import Footer from '../components/oldSite/Footer'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Cookies from 'universal-cookie'
import PlausibleProvider from 'next-plausible'
import * as fbq from '../lib/fpixel';
import GoogleAds from '../components/oldSite/GoogleAds'
import MainLayout from '../components/MainLayout'
import Image from 'next/image'
import MainFooter from '../components/MainFooter'

export async function getServerSideProps(context: any) {

    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user = session?.user
    // if (user !== undefined) {
    //   return {
    //     redirect: {
    //       destination: '/dashboard',
    //       permanent: false,
    //     },
    //   }
    // } else {
    //   return {
    //     props: {},
    //   }
    // }
    if (user) {
        delete user.emailVerified;
    }
    return {
        props: {
            user: user || false
        },
    }
}


const Pricing: React.FC<{ user: any }> = ({ user }) => {
    const router = useRouter();
    const { data: session } = useSession()
    const [isAuthed, setIsAuthed] = useState(!!user)
    const [freeTrial, setFreeTrial] = useState(false)
    const [pricing, setPricing] = useState(true);
    const [title, setTitle] = useState("Arbitrage and Purchasing Listings at Your Fingertips");


    useEffect(() => {
        const cookies = new Cookies()
        const isHostConCookie = cookies.get('isHostCon')
        if (isHostConCookie === "true") {
            setFreeTrial(true)
        }
        if (router.query.trial === "true") {
            cookies.set("isHostCon", "true")
            setFreeTrial(true)
        }
        if (router.query.error === "outOfFreeSearches") {
            setTitle("You're out of free searches, please upgrade to continue.")
        }
        if (router.query.error === "unpaid") {
            setTitle("You must upgrade before accessing the dashboard.")
        }
    }, [router.query.error])

    const handlePricingClick = async (priceId: string) => {
        if (session) {
            await fbq.event('Add-to-Cart', { plan: priceId })
            let userSession: any = session?.user
            console.log(userSession, 'userSession')
            if (userSession?.plan !== 'TRIAL' && userSession?.plan !== 'UNPAID') {
                const res = await fetch('/api/customerportal', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                return router.push(data.url)
            }
            console.log('here PAYMENT', priceId)

            const cookies = new Cookies()
            const ref = cookies.get('ref')
            const res = await fetch('/api/createcheckoutsession', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: priceId,
                    customerId: userSession?.customerId,
                    needsTrial: freeTrial,
                    ref
                })
            })
            const data = await res.json()
            console.log(data)
            router.push(data.url)
        } else {
            await fbq.event('Purchase-Redirect', { plan: "NO PLAN, user is redirected to signup page.", })
            console.log('here PAYMENT UNAUTHED')
            router.push('/signup')
        }
    }


    return (
        <>
            <GoogleAds />
            <PlausibleProvider domain="fetchit.ai">
                <section>
                    <MainLayout>
                        <MainNavbar authed={isAuthed} />
                        <div>
                            <div className={styles.sublayout}>
                                <header className={styles.header}>
                                    <span className={styles.small__tag}>Pricing</span>
                                    <h1>Meet simple & transparent pricing</h1>
                                    <span className={styles.description}>Discover your ideal Airbnb with Fetchit&apos;s powerful search engine that locates land, houses, apartments, and more.</span>
                                </header>
                                <div className={styles.flex}>
                                    <PriceCards pricing={pricing} handleClick={handlePricingClick} isHostCon={freeTrial} />
                                    <div className={styles.faq}>
                                        <h3 className={styles.faq__title}>Frequently Asked Questions</h3>
                                        <section style={{ maxWidth: '649.008px', border: "1px solid rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}>
                                            <details>
                                                <summary className={styles.sum}>How do I create an account?</summary>
                                                <p className={styles.details}>
                                                    Look for a button or link that says Sign Up. This is usually located in the top right corner of the homepage.
                                                    Click on the Sign Up button.
                                                    A form will appear for you to fill out with your personal information, such as your name, email address, and password.
                                                    Fill out the form with the required information and any optional information you wish to provide.
                                                    Review the website&apos;s terms and conditions and privacy policy, and check the box to indicate that you agree to these terms.
                                                    Click the Create Account button to submit the form and complete the account creation process.
                                                </p>
                                            </details>
                                            <details>
                                                <summary className={styles.sum}>How do I contact customer support for help or to report a problem with the website?</summary>
                                                <p className={styles.details}>
                                                    Go to the homepage of the website.
                                                    Look for a link or button that says Contact Us, Customer Support, or something similar. This is usually located in the footer or bottom of the homepage.
                                                    Click on the Contact Us or Customer Support link.
                                                    A form or a page with contact information will appear.
                                                    Follow the instructions provided to submit a request for help or to report a problem with the website. This may involve filling out a form with your name, email address, and a description of your issue, or it may involve using a phone number or email address to contact customer support directly.
                                                </p>
                                            </details>
                                            <details >
                                                <summary className={styles.sum}>Can I customized my searches?</summary>
                                                <p className={styles.details}>
                                                    Go to the search page or section of the website. This is usually located in the top or side menu of the homepage.
                                                    Look for a button or link that says Filter Results or something similar. This is usually located near the search bar or above the search results.
                                                    Click on the Filter Results button.
                                                    A panel or menu will appear with options for filtering the search results.
                                                    Select the desired filters by clicking on the checkboxes, dropdown menus, or other controls provided. You may be able to filter by categories, keywords, dates, or other criteria depending on the specific website and the type of content it provides.
                                                    Click the Apply or Update button to apply the filters and update the search results.
                                                </p>
                                            </details>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <MainFooter />
                    </MainLayout>
                </section>
            </PlausibleProvider>
        </>
    )
}

export default Pricing;