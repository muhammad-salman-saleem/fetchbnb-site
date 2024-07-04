import React, { useState } from "react";
import styles from '../styles/Coaching.module.css'
import Image from "next/image";

const searchOptions = [
    {
        name: "Glamping",
        unselectedImage: '/imgs/glamping_unselected.svg',
        selectedImage: '/imgs/glamping.svg'
    },
    {
        name: "Arbitrage / Subleasing",
        unselectedImage: '/imgs/treehouse.svg',
        selectedImage: '/imgs/treehouse_selected.svg'
    },
    {
        name: "New Construction",
        unselectedImage: '/imgs/newconstruction.svg',
        selectedImage: '/imgs/newconstruction_luxury.svg'
    },
    {
        name: "Midterm Rentals",
        unselectedImage: '/imgs/luxury.svg',
        selectedImage: '/imgs/lux_selected.svg'
    }
]


const DropDownWithSearch: React.FC<{ index: number, setIndex: any, handleSearch: any, update: any }> = ({ index, setIndex, handleSearch, update }) => {
    const [isOpen, setIsOpen] = useState(false);

    const onParentClick = () => {
        setIsOpen(prev => !prev);
    }

    const selectItem = (i: number) => {
        setIndex(i);
        update({ search: searchOptions[i] })
        setIsOpen(false);
    }

    return (
        <div className={styles.dropdown__container}>
            <div className={styles.dropdown__parent} onClick={onParentClick}>
                <div className={styles.dropdown__child}>
                    <Image className={styles.dropdown__img__container} alt='' src={searchOptions[index].selectedImage} width='21' height='21' />
                    <span className={styles.dropdown__child__font}>{searchOptions[index].name}</span>
                </div>
                <div className={styles.dropdown__img__container}>
                    <Image src='/imgs/arrow_down.svg' width='15' height='15' alt='' />
                </div>
            </div>
            <button className={styles.dropdown__button} onClick={handleSearch}>
                <Image src='/imgs/dashsearch.svg' width='17' height='17' alt='' />
            </button>
            {isOpen ? <div className={styles.dropwdown__item__container}>
                {searchOptions.map((option, i) => {
                    return (
                        <div onClick={() => selectItem(i)} className={styles.dropwdown__item} key={i}>
                            <Image alt='' src={index === i ? option.selectedImage : option.unselectedImage} width='21' height='21' />
                            <span>{option.name}</span>
                        </div>
                    )
                })
                }
            </div> : <></>}
        </div>
    )
}

export default DropDownWithSearch;