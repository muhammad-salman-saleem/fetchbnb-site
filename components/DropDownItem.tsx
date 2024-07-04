import React, { FC } from 'react'
import styles from '../styles/FilterDropDown.module.css';

const DropDownItem: FC<{ onClick: (x: any) => void; children: React.ReactNode; value: string; isSelected: boolean, setSelected: (x: any) => void; toggleDropDown: () => void}> = ({ onClick, children, value, isSelected, setSelected, toggleDropDown }) => {

    const unSelectedfontStyles = {
        fontFamily: 'Inter',
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "13px",
        lineHeight: "16px",
        color: "#999999"
    }

    const selectedfontStyles = {
        fontFamily: 'Inter',
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "13px",
        lineHeight: "16px",
        color: "#5271FF"
    }

    return (
        <div className={styles.drowndownitem} onClick={() => {
            onClick(value)
            if(isSelected) {
                return
            }
            setSelected(value)
            toggleDropDown()
        }}>
            <span style={isSelected ? selectedfontStyles : unSelectedfontStyles}>{children}</span>
        </div>
    )
}

export default DropDownItem