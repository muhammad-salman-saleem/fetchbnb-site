import React from 'react'
import MainLayout from './MainLayout';
import styles from '../styles/MainFooter.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MainFooter = () => {
    const router = useRouter();
    return (
        <div>
            <MainLayout>
                <div className={styles.footer__container}>
                    <div>
                        <Image src='/imgs/logo.svg' alt='' width='104' height='32' />
                    </div>
                    <div className={styles.footer__links}>
                        <Link href='/#features' className={styles.footer__link}>Features</Link>
                        <Link href='/#testimonials' className={styles.footer__link}>Testimonials</Link>
                        <Link href='/dashboard'  className={styles.footer__link}>Dashboard</Link>
                        <Link href='/#referrals' className={styles.footer__link}>Referrals</Link>
                        <Link href='/pricing' className={styles.footer__link}>Pricing</Link>
                        <Link href='https://blog.fetchit.ai/' className={styles.footer__link}>Blog</Link>
                    </div>
                    <div className={styles.footer__auth}>
                        <button onClick={() => router.push('/login')} className={styles.auth__login}>Login</button>
                        <button onClick={() => router.push('/signup')} className={styles.auth__signup}>Sign Up</button>
                    </div>
                </div>
                <hr className={styles.footer__hr}/>
                <div>
                <div className={styles.footer__important__links}>
                    <div className={styles.footer__important__left}>
                        <span className={styles.footer__important__link}>Features</span>
                        <span className={styles.footer__important__link}>Testimonials</span>
                        </div>
                        <span className={styles.footer__important__link}>Dashboard</span>
                    </div>
                </div>
            </MainLayout>
        </div>
    )
}

export default MainFooter