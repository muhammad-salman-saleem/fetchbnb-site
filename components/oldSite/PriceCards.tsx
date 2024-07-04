import React, { FC, useState } from 'react'
import styles from '../../styles/PriceCards.module.css';
import PriceItem from '../oldSite/PriceItem';
import PriceTag from '../oldSite/PriceTag';
import Image from 'next/image';
import { useRouter } from 'next/router';

const priceIds = [process.env.NEXT_PUBLIC_STRIPE_PRODUCT_1, process.env.NEXT_PUBLIC_STRIPE_PRODUCT_2, process.env.NEXT_PUBLIC_STRIPE_PRODUCT_3, process.env.NEXT_PUBLIC_STRIPE_PRODUCT_4, process.env.NEXT_PUBLIC_STRIPE_PRODUCT_5] as string[];

const generateToggleResult = (toggle: boolean, type: string) => {
    if (type === "font1") {
        return !toggle ? styles["selected__price__font"] : styles["unselected__price__font"];
    }
    if (type === "font2") {
        return toggle ? styles["selected__price__font"] : styles["unselected__price__font"];
    }
    if (type === "button") {
        return !toggle ? "flex-start" : "flex-end";
    }
    if (type === "stripe") {
        return !toggle ? priceIds[3] : priceIds[2];
    }
}

export const PriceCards: FC<{ pricing: boolean, handleClick: (priceId: string) => void; isHostCon?: boolean }> = ({ pricing, handleClick, isHostCon = false }) => {
    const router = useRouter();
    const [toggle, setToggle] = useState(true);
    const [stripeProduct, setStripeProduct] = useState(generateToggleResult(toggle, "stripe"));

    React.useEffect(() => {
        setStripeProduct(generateToggleResult(toggle, "stripe"));
    }, [toggle])

    const toggleButton = () => {
        setToggle(prev => {
            return !prev
        });

    }

    return (
        <div className={styles.flex}>
            <div className={styles.pricing__container}>
                <h4 className={styles.pricing__title}>Fetchit Full Access</h4>
                <span className={styles.pricing__desc}>Explore your dream property with Fetchit. Join now and access our extensive database. <span style={{ fontSize: "10px" }}>Non refundable.</span></span>
                <span className={styles.price__font__1}>${!toggle ? "53.50" : "37.45"}<span className={styles.price__font__2}>/month</span></span>
                {isHostCon ? <span className={styles.price__font__trial}>
                    1 week, Free Trial
                </span> : <></>}
                <button className={styles.price__button} onClick={() => handleClick(stripeProduct as string)}>Subscribe</button>
                <div className={styles.price__font__container}>
                    <div className={styles.price__check__container}>
                        <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                        <span
                            className={styles.price__check__font__bold}>Queries for Land, Houses, & Apartments</span>
                    </div>
                    <div className={styles.price__check__container}>
                        <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                        <span className={styles.price__check__font}>Total Property search</span>
                    </div>
                    <div className={styles.price__check__container}>
                        <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                        <span className={styles.price__check__font}>Short-term Rental Info</span>
                    </div>
                    <div className={styles.price__check__container}>
                        <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                        <span className={styles.price__check__font}>Zoning and ordinance laws</span>
                    </div>
                </div>
                <Image className={styles.price__image__1} src='/imgs/pricingcard1.svg' width='89' height='90' alt='' />
                <Image className={styles.price__image__2} src='/imgs/pricingcard2.svg' width='64' height='62' alt='' />
            </div>
            <div className={styles.toggle__container}>
                <span className={generateToggleResult(toggle, "font1")}>Monthly</span>
                <div onClick={toggleButton} style={{ justifyContent: `${generateToggleResult(toggle, "button")}` }} className={styles.toggle}>
                    <div className={styles.circle__left}></div>
                </div>
                <span className={generateToggleResult(toggle, "font2")}>Yearly &nbsp; <span className={styles.pricecolor}>(30% off)</span></span>
            </div>
        </div>
    )
}