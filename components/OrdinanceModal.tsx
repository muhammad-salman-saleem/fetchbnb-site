import React from 'react'
import styles from '../styles/OrdinanceModal.module.css';
import Image from "next/image";

const OrdItem: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div className={styles.orditemwrapper}>
            <Image className={styles.circle} src={'/imgs/greycircle.svg'} alt={''} width='6' height='6' />
            <span className={styles.orditemwrapper__font}>
                {value}
            </span>
        </div>
    )
}

const OrdinanceModal: React.FC<any> = ({ ord, stateCode, missing, submitMissing }) => {
    const [value, setValue] = React.useState('');
    if (missing) {
        return (
            <div style={{ paddingTop: "20px" }}>
                <h4 className={styles.title}> <span>Your request was submited! Do you want to share your knowledge with the community?</span></h4>
                <input value={value} onChange={(e) => setValue(e.target.value)} className={styles.missing__input} type="text" placeholder='Your knowledge' />
                <button onClick={() => submitMissing(value)} className={styles.missing__button}>Submit</button>
            </div>
        )
    }
    console.log(ord, "ord")
    return (
        <div>
            <h4 className={styles.title}>{ord?.location?.locationName}, {stateCode} <span>Ordinances</span></h4>
            <span
                className={styles.subtitle}>Below are ordinances for the {ord?.location.typeOfLocation} of “{ord?.location?.locationName}, {stateCode}”</span>
            <div className={styles.container}>
                {ord?.result?.map((ordValue: string, index: number) => (
                    <OrdItem key={index} value={ordValue} />
                ))}
            </div>
            <span className={styles.subtitle}>Last updated: {ord?.date}</span>
        </div>
    )
}

export default OrdinanceModal;