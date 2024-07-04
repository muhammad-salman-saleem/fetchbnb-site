import React from 'react';
import BaseLanding from '../components/BaseLanding';
import styles from '../styles/landing.module.css'
import Link from 'next/link';

const LandingLifeTimeAccess = () => {
    const t1 = 'Limited-Time Offer: Only 5 Spots Left for Lifetime Access! '
    return (
        <div className={styles.main_container}>
            <div className={styles.background}></div>
            <div className={styles.zindex} >
                <BaseLanding t1={t1} />
                <div className={styles.video_section}>
                    <video
                        src={`/videos/video1.MP4`}
                        controls={true}
                    />
                </div>
                <div className={styles.grand_font} >Only 5 spots left for Lifetime Access! Purchase now to gain exclusive membership to our Facebook group for life. </div>
                <div className={styles.grand_font} > Connect with like-minded individuals in the short-term rental space, sharing knowledge and growing together.</div>
                <Link className={styles.btn1} href='/signup' >Join the Fetchit Community</Link>
            </div>
        </div>
    );
};

export default LandingLifeTimeAccess;