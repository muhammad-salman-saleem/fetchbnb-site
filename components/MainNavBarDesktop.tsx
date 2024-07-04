import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/MainNavbar.module.css';
import { useRouter } from 'next/router';

const MainNavBarDesktop: React.FC<{ page?: string, authed?: boolean; landingPage?: boolean; }> = ({ page, authed = false, landingPage = false }) => {
    const router = useRouter();
    return (
        <nav className={styles.navbar}>
            <Link href='/'><Image src='/imgs/logo.svg' width='104' height='32' alt={'Fetchit Logo'} /></Link>
            {page !== "authpage" ?
                <>
                    {landingPage === false ?
                        <div className={styles.links__container}>
                            <Link className={styles.link} href="/#features">Features</Link>
                            <Link className={styles.link} href="/#referrals">Referrals</Link>
                            <Link className={styles.link} href="/#testimonials">Testimonials</Link>
                            <Link className={styles.link} href="/pricing">Pricing</Link>
                            <Link className={styles.link} href="/dashboard">Dashboard</Link>
                        </div>
                        : <div></div>}
                    {authed === false ? <div className={styles.auth__buttons}>
                        {landingPage === false ?
                            <>
                                <button onClick={() => router.push('/login')} className={styles.auth__login}>Login</button>
                                <button onClick={() => router.push('/signup')} className={styles.auth__signup}>Sign Up</button>
                            </>
                        : <Link href={'/'}  className={styles.mainsite}>Head to Main Site</Link>}
                    </div> : <div></div>}
                </>
                : <></>}
        </nav>
    )
}

export default MainNavBarDesktop