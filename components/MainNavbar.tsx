import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/MainNavbar.module.css';
import useWindowDimensions from './hooks/useWindowDimensions';
import MainNavBarDesktop from './MainNavBarDesktop';
import MainNavbarMobile from './MainNavbarMobile';

const MainNavbar: React.FC<{ page?: string, authed?: boolean; landingPage?: boolean; }> = ({ page, authed = false, landingPage = false }) => {
    const isMobileState = useWindowDimensions();
    if (isMobileState.generalSize === 'desktop') {
        return (
            <header>
                <MainNavBarDesktop page={page} authed={authed} landingPage={landingPage} />
            </header>
        )
    } else {
        return (
            <header>
                <MainNavbarMobile page={page} authed={authed} landingPage={landingPage} />
            </header>
        )
    }
}

export default MainNavbar