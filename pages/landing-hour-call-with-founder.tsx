import React from 'react';
import BaseLanding from '../components/BaseLanding';
import styles from '../styles/landing.module.css'


const LandingFounderCall = () => {
    const t1 = 'Limited-Time Offer: Sign Up Before July 28th for a Free 1-Hour Strategy Call with Our Founder!'
    return (
        <div className={styles.main_container} >
            <div className={styles.background}></div>
            <div className={styles.zindex}>
                <BaseLanding t1={t1} />
                <div className={styles.grand_font}>Sign up for our monthly subscription plan and gain access to a wealth of short-term rental data and insights. But hurry, if you sign up before July 28th, </div>
                <div className={styles.grand_font}> {"you'll"} receive a complimentary 1-hour strategy call with our founder. Get personalized advice and guidance to take your rental business to the next level.</div>
                <div className={styles.discover}>Discover What Our Customers Have to Say</div>
                <div className={styles.video_section}>
                    <video
                        src={`/videos/video1.MP4`}
                        controls={true}
                    />
                </div>
            </div>
        </div>

    );
};

export default LandingFounderCall;