import React, {FC} from 'react'
import styles from '../styles/Homepage.module.css';
import Image from 'next/image';
import {useRouter} from "next/router";

type MainPreviewHouseCardProps = {
    entries?: {
        image: string;
        address: string;
        subaddress: string;
        beds: number;
        baths: number;
        sqft: string;
        booked: number;
        dailyRate: number;
        price: string;
    };
    isFinal?: boolean;
};

const MainPreviewHouseCard: FC<MainPreviewHouseCardProps> = ({entries, isFinal = undefined}) => {
    const router = useRouter();
    if (isFinal === undefined && entries !== undefined) {
        return (
            <div className={styles.preview__house__card}>
                <Image alt='house image' src={entries.image} width='260' height='150'/>
                <div className={styles.preview__house__sub__container}>
                    <h1 className={styles.preview__address__font}>{entries.address}</h1>
                    <p className={styles.preview__subaddress__font}>{entries.subaddress}</p>
                    <div className={styles.preview__chips__container}>
                        <div className={styles.preview__chips}>
                            <Image alt='icon' src='/imgs/bed_preview_icon_1.svg' width='18' height='18'/>
                            <span>{entries.beds}</span>
                        </div>
                        <div className={styles.preview__chips}>
                            <Image alt='icon' src='/imgs/bed_preview_icon_2.svg' width='18' height='18'/>
                            <span>{entries.baths}</span>
                        </div>
                        <div className={styles.preview__chips}>
                            <Image alt='icon' src='/imgs/bed_preview_icon_3.svg' width='18' height='18'/>
                            <span>{entries.sqft} sqft</span>
                        </div>
                    </div>
                    <div>
                        <p className={styles.preview__info__alignment}>
                            <span className={styles.preview__info__bold}>{entries.booked}/d</span>
                            <span className={styles.preview__info__font}>Booked per Month</span>
                        </p>
                        <p className={styles.preview__info__alignment}>
                            <span className={styles.preview__info__bold}>${entries.dailyRate}</span>
                            <span className={styles.preview__info__font}>Average daily rate (ADR)</span>
                        </p>
                    </div>
                    <div className={styles.preview__cta__container}>
                        <span className={styles.preview__cta__font}>${entries.price}</span>
                        <button className={styles.preview__cta__button} onClick={() => router.push('/signup')}>View
                            more
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.preview__house__card}>
            <div className={`${styles.preview__house__sub__container} ${styles.preview__house__sub__flex}`}>
                <div>
                    <Image alt='icon' src='/imgs/house_preview_3.png' width='69' height='69'/>
                    <h1 className={styles.preview__final__font}>Want to see more?</h1>
                    <p className={styles.preview__final__subfont}>Don&apos;t be left in the dust with outdated software. Sign up now to learn about our game-changing rental tool. Trust me, it&apos;s painless and worth it.</p>
                </div>
                <button className={styles.preview__final__button}>See more</button>
            </div>
        </div>
    )
}

export default MainPreviewHouseCard