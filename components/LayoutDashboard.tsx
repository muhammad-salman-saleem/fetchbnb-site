import React, { FC } from 'react'
import styles from '../styles/LayoutDashboard.module.css';

const LayoutDashboard: FC<{ children: React.ReactNode, isCentered?: boolean }> = ({ children, isCentered = true }, ) => {
    return (
        <div className={`${isCentered ? styles.layout : styles.layout__uncetered}`}>
            {children}
        </div>
    )
}

export default LayoutDashboard