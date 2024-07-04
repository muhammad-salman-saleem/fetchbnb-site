import React from 'react';
import styles from '../../styles/PriceTag.module.css';

const PriceTag: React.FC<{ price: number, pricingType: boolean, highest?: boolean; isHostCon?: boolean }> = ({ price, pricingType, highest = false, isHostCon = false }) => {
    if (pricingType === false) {
        price = Math.round((price * 12) * .90);
    }
    if (highest) {
        return (
            <div style={{ paddingBottom: "10px" }}>
                {isHostCon ? <div>
                    <span className={styles.small__high__hostcon}>$</span>
                    <span className={styles.price__high__hostcon} style={{ textDecoration: "line-through" }}>70</span>
                    <span className={styles.small__high__hostcon}>/{(pricingType ? "month" : "year")}</span>
                </div> : <></>}
                <span className={styles.small__high}>$</span>
                <span className={styles.price__high}>{price}</span>
                <span className={styles.small__high}>/{(pricingType ? (isHostCon ? "month with 1 free week!" : "month") : "year")}</span>
            </div>
        )
    }
    return (
        <div style={{ paddingBottom: "10px" }}>
            <span className={styles.small}>$</span>
            <span className={styles.price}>{price}</span>
            <span className={styles.small}>/{(pricingType ? "month" : "year")}</span>
        </div>
    )
}

export default PriceTag