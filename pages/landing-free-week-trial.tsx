import React from 'react';
import styles from '../styles/landing.module.css'
import BaseLanding from '../components/BaseLanding';


const LandingFreeTrial = () => {
    const t1 = 'Sign Up Before July 28th for a Free Week Trial!'
    return (
        <div className={styles.main_container} >
            <div className={styles.background}></div>
            <div className={styles.zindex}>
                <BaseLanding t1={t1} />
                <div className={styles.grand_font} >Sign up before July 28th and enjoy a free week trial of our monthly subscription plan. Gain access to a wealth of short-term rental data and insights to take your rental business to the next level.</div>
                <div className={styles.discover}>Discover What Our Customers Have to Say</div>
                <div className={styles.video_section} >
                    <video
                        src={`/videos/video1.MP4`}
                        controls={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingFreeTrial;