import React from 'react';
import styles from '../styles/landing3.module.css'
import BaseLanding from '../components/BaseLanding';
import Image from 'next/image';
import accountIcon from '../public/imgs/account.png'

const landingPriceAndCoverage = () => {
    const t1 = 'Sign Up Before July 28th for a Free Week Trial!'
    return (
        <div className={styles.main_container} >
            <div className={styles.zindex}>
                <div className={styles.accout_avatar}>
                    <div className={styles.accountIconWrapper}>
                        <img className={styles.accountIcon} src={`/imgs/account.png`} /> </div>
                </div>
                <div className={styles.content} style={{ width: '100%' }}>
                    <div className={styles.cards_container}>
                        <div className={styles.card}>
                            <div className={styles.card_bg}></div>
                            <div className={styles.card_title}>Pre-calculation and display of both for sale and for rent listings:</div>
                            <div className={styles.name}>
                                <img className={styles.fetchit} width={'150px'} src={'/imgs/fetchitLogo.png'} />
                                <img className={styles.tickGreen} width={'60px'} src={'/imgs/tickGreen.png'} />
                            </div>
                            <div className={styles.name}>
                                <div style={{ fontSize: '2.6rem', marginBottom: '10px' }}>Airdna</div>
                                <img className={styles.crossIcon} src={'/imgs/cross.png'} />
                            </div>
                            <div className={styles.Payment_btn}>Payment Hire</div>
                        </div>
                        <div className={styles.card_center} >
                            <div className={styles.card_bg_center}></div>
                            <div className={styles.card_title}>Automation (Saves thousands of hours of work):</div>
                            <div className={styles.name}>
                                <img width={'150px'} src={'/imgs/fetchitLogo.png'} />
                                <img width={'60px'} src={'/imgs/tickGreen.png'} />
                            </div>
                            <div className={styles.name}>
                                <div style={{ fontSize: '2.6rem', marginBottom: '10px' }}>Airdna</div>
                                <img width={'50px'} src={'/imgs/cross.png'} />
                            </div>
                            <div className={styles.Payment_btn_center}>Payment Hire</div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.card_bg}></div>
                            <div className={styles.card_title}>Pre-calculation and display of both for sale and for rent listings:</div>
                            <div className={styles.name}>
                                <img className={styles.fetchit} width={'150px'} src={'/imgs/fetchitLogo.png'} />
                                <img className={styles.tickGreen} width={'60px'} src={'/imgs/tickGreen.png'} />
                            </div>
                            <div className={styles.name}>
                                <div style={{ fontSize: '2.6rem', marginBottom: '10px' }}>Airdna</div>
                                <img className={styles.crossIcon} src={'/imgs/cross.png'} />
                            </div>
                            <div className={styles.Payment_btn}>Payment Hire</div>
                        </div>
                    </div>
                    <div className={styles.right_content}>
                        <div className={styles.side_text} style={{ marginBottom: '60px' }}>Pricing and Coverage:</div>
                        <div className={styles.side_text}>Fetchit: </div>
                        <div className={styles.side_text}>$53 for nationwide coverage</div>
                        <div className={styles.link}>www.fetchit.ai</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default landingPriceAndCoverage;