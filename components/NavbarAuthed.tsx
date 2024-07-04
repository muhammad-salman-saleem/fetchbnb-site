import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import styles from '../styles/NavbarAuthed.module.css';
import useWindowDimensions from '../components/hooks/useWindowDimensions';
import LayoutDashboard from './LayoutDashboard';
import { useRouter } from "next/router";

const NavbarDesktop = () => {
    const router = useRouter();
    const handleBtnClick = () => {
        router.push('/profile')
    }
    console.log({ path: router.pathname })

    const genStyles = (link: string) => {
        if (link === router.pathname) {
            return styles.selected
        }
        return styles.nonselected
    }

    return (
        <div className={styles.container}>
            <div className={styles.navbar__main__content}>
                <Image src='/imgs/logo.svg' alt='logo' width='124' height='40' />
                <div className={styles.navbar__links}>
                    <Link href='/pricing' className={genStyles('/pricing')}>Pricing</Link>
                    <Link href='/dashboard' className={genStyles('/dashboard')}>Dashboard</Link>
                    <Link href='/dashboard/coaching' className={genStyles('/dashboard/coaching')}>Fetchit University</Link>
                    <Link href='/va' className={genStyles('/va')}>Virtual Assistants</Link>
                </div>
            </div>
            <div className={styles.auth}>
                <button className={styles.auth__btn} onClick={handleBtnClick}>
                    <Image alt='logout button' src='/imgs/logout.svg' width='24' height='24' />
                </button>
                {/*<span>Welcome, Jack S</span>*/}
                <Image style={{ display: "none" }} className={styles.profimg} alt='profile image' src='/imgs/defprof.svg' width='48' height='48' />

            </div>
        </div>
    )
}

const NavbarMobile = () => {
    const [showLinks, setShowLinks] = useState(false);
    const handleClick = () => {
        setShowLinks(prev => !prev);
    }
    const router = useRouter();
    const handleBtnClick = () => {
        router.push('/profile')
    }

    const genStyles = (link: string) => {
        if (link === router.pathname) {
            return styles.selected
        }
        return styles.nonselected
    }
    return (
        <div className={styles.container__mobile__parent}>
            <div className={styles.container__mobile}>
                <div className={styles.navbar__main__content}>
                    <Image src='/imgs/logo.svg' alt='logo' width='124' height='40' />
                </div>
                <div onClick={handleClick} className={styles.hamburger__menu}>
                    <Image src='/imgs/hamburger.svg' width='23' height='13' alt='nav menu toggle' />
                </div>
            </div>
            {showLinks ? <>
                <div className={styles.auth}>
                    <button className={styles.auth__btn} onClick={handleBtnClick}>
                        <Image alt='logout button' src='/imgs/logout.svg' width='24' height='24' />
                    </button>
                    {/*<span>Welcome, Jack S</span>*/}
                    <Image className={styles.profimg} alt='profile image' src='/imgs/defprof.svg' width='48' height='48' />
                </div>
                <div className={styles.navbar__links__mobile}>
                    <Link href='/pricing' className={genStyles('/pricing')}>Pricing</Link>
                    <Link href='/dashboard' className={genStyles('/dashboard')}>Dashboard</Link>
                    <Link href='/dashboard/coaching' className={genStyles('/dashboard/coaching')}>Fetchit University</Link>
                    <Link href='/va' className={genStyles('/va')}>Virtual Assistants</Link>
                </div>
            </> : <></>}
        </div>
    )
}

const NavbarAuthed = () => {
    const windowDimensions = useWindowDimensions();
    if (windowDimensions.width <= 847) {
        return (
            <header>
                <LayoutDashboard>
                    <NavbarMobile />
                </LayoutDashboard>
            </header>
        )
    }
    return (
        <header>
            <LayoutDashboard>
                <NavbarDesktop />
            </LayoutDashboard>
        </header>
    )
}

export default NavbarAuthed;