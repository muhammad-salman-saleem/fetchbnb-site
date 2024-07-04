import React, { FC } from 'react'
import styles from '../styles/MainLargerOverflowLayout.module.css';

type MainOverflowLayout = {
    children: React.ReactNode
}

const MainOverLflowLayout: FC<MainOverflowLayout> = ({ children }) => {
    return (
        <div className={styles.layout}>{children}</div>
    )
}

export default MainOverLflowLayout
