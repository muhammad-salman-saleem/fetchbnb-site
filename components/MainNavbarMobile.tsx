import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/MainNavbar.module.css';
import { useRouter } from 'next/router';
const MainNavbarMobile: React.FC<{ page?: string, authed?: boolean; landingPage?: boolean; }> = ({ page, authed = false, landingPage = false }) => {
    const [showLinks, setShowLinks] = useState(false);
    const handleClick = () => {
        setShowLinks(prev => !prev);
    }
    const router = useRouter();
    return (
        <>
            <nav className={styles.navbar}>
                <Link href='/'><Image src='/imgs/logo.svg' width='104' height='32' alt={'Fetchit Logo'} /></Link>
                {page !== "authpage" ?
                    <>
                        <div className={styles.auth__buttons}>
                            {authed === false ?
                                <>{landingPage === false ?
                                    <>
                                        <button onClick={() => router.push('/login')} className={styles.auth__login}>Login</button>
                                        <button onClick={() => router.push('/signup')} className={styles.auth__signup}>Sign Up</button>
                                    </>
                                    : <Link href={'/'} className={styles.mainsite}>Head to Main Site</Link> }
                                </>
                                : <div></div>}
                            {landingPage === false ?
                                <div onClick={handleClick} className={styles.hamburger__menu}>
                                    <Image src='/imgs/hamburger.svg' width='23' height='13' alt='nav menu toggle' />
                                </div> : <div></div>}
                        </div>
                    </>
                    : <></>}
            </nav>
            {showLinks && landingPage === false ?
                <div className={styles.links__mobile__container}>
                    <Link className={styles.link} href="/#features">Features</Link>
                    <Link className={styles.link} href="/#referrals">Referrals</Link>
                    <Link className={styles.link} href="/#testimonials">Testimonials</Link>
                    <Link className={styles.link} href="/pricing">Pricing</Link>
                    <Link className={styles.link} href="/dashboard">Dashboard</Link>
                </div>
                : <></>
            }
        </>
    )
}

export default MainNavbarMobile