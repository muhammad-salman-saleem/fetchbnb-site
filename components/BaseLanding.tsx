import React from 'react';
import styles from '../styles/landing.module.css'
import Image from 'next/image'
import Link from 'next/link';
type Heading ={
    t1:string
}
const BaseLanding = ({ t1 }: Heading) => {
    return (
        <div className={styles.content}>
            <div className={styles.top_heading} >Unlock the Power of Short-Term Rental Data with Fetchit</div>

            <div  className={styles.text_border}>{t1}</div>
            <hr className={styles.hr}/>
            <div style={{width:'100%'}}>
              <img style={{ width:'100%'}}   alt=" something"  src={'/imgs/main_image.png'} />
            </div>
            
            <div className={styles.whyfetchit}>Why Fetchit?</div>
            <div className={styles.para}><span className={styles.weight6}>Accurate Earnings Estimates: </span>Our advanced algorithms analyze market data to provide precise estimates on your Airbnb rental earnings.</div>
            <div className={styles.para}><span className={styles.weight6}>Targeted Insights: </span>Gain a competitive edge with neighborhood-specific data and trends, optimizing your rental income.</div>
            <div className={styles.para}><span className={styles.weight6}> Nationwide Coverage: </span>Fetchit covers the entire USA, giving you valuable insights no matter where your properties are located.</div>
            <div className={styles.para}><span className={styles.weight6}>Local Regulations Awareness: </span> We inform you of local short-term rental data, helping you stay compliant and avoid regulatory issues.</div>

            <div className={styles.para}><span className={styles.weight6}>Simple and Intuitive: </span>{"Fetchit's"} user-friendly interface provides fast, actionable insights with no technical skills required.</div>
            <div className={styles.grand_font} style={{marginTop:'40px'}}>Unleash Your Earning Potential</div>
            <div className={styles.grand_font} style={{marginTop:'20px'}}>Whether {"you're"} a seasoned host or just starting out, Fetchit empowers you to thrive in the short-term rental market.</div>
            <Link className={styles.btn1} href='/signup' >Join the Fetchit Community</Link>
        </div>
    );
};

export default BaseLanding;