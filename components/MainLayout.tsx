import React, { FC } from 'react'
import styles from '../styles/MainLayout.module.css';

type MainLayoutProps = {
    children: React.ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className={styles.layout}>{children}</div>
    )
}

export default MainLayout