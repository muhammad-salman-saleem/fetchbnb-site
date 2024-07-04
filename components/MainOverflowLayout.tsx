import React, { FC } from 'react'
import styles from '../styles/MainOverflowLayout.module.css';

type MainOverflowLayout = {
    children: React.ReactNode
}

const MainOverflowLayout: FC<MainOverflowLayout> = ({ children }) => {
    return (
        <div className={styles.layout}>{children}</div>
    )
}

export default MainOverflowLayout
