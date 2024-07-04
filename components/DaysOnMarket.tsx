import React, { useState } from 'react'
import styles from '../styles/FilterDropDown.module.css';

const DaysOnMarket: React.FC<{value: number, onChange: any}> = ({value, onChange}) => {
    return (
        <div className={styles.days__container}>
            <div onClick={() => onChange(value !== 4 ? 4 : 0)} className={value === 4 ? styles.selected : styles.unselected} >4</div>
            <div  onClick={() => onChange(value !== 14 ? 14 : 0)} className={value === 14 ? styles.selected : styles.unselected}>14</div>
            <div  onClick={() => onChange(value !== 21 ? 21 : 0)} className={value === 21 ? styles.selected : styles.unselected}>21</div>
            <div  onClick={() => onChange(value !== 30 ? 30 : 0)} className={value === 30 ? styles.selected : styles.unselected}>30</div>
        </div>
    )
}

export default DaysOnMarket