import React, { FC, useState } from 'react'
import { Filters } from '../shared/interfaces/Filters';
import styles from '../styles/LargeToggle.module.css';

type LargeToggleProps = {
    off?: string;
    on?: string;
    handleClick: (value: boolean, filterKey: string) => void;
    filters: any;
    filterKey: any;
}

const LargeToggle: FC<LargeToggleProps> = ({ off = "Off", on = "On", handleClick, filters, filterKey }) => {
    const [isOn, setIsOn] = useState<any>(filters[filterKey] as any);
    const handleToggleClick = () => {
        setIsOn((prev: any) => {
            handleClick(!prev, filterKey);
            return !prev
        });
    }
    return (
        <div className={styles.container} onClick={handleToggleClick}>
            <span>{off}</span>
            <div className={styles.toggle__container}>
                <div className={isOn ? styles.toggle__circle__on : styles.toggle__circle__off}></div>
            </div>
            <span>{on}</span>
        </div>
    )
}

export default LargeToggle