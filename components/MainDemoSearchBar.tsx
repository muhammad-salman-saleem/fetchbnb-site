import Image from 'next/image';
import React, { useState } from 'react'
import styles from '../styles/MainDemoSearchBar.module.css';
import {useRouter} from "next/router";

const LocationInput: React.FC<{value: string, setValue: (x: string) => void;}> = ({value, setValue}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(prev => !prev);
    }

    if (isClicked) {
        return (
            <div className={`${styles.lower} ${styles.text__cursor}`}>
                <input onChange={(event => setValue(event.target.value))} value={value} className={styles.lower__input} type='text' placeholder='Enter Location' />
            </div>
        )
    }

    return (
        <div onClick={handleClick} className={`${styles.lower} ${styles.lower__clicked}`}>
            <span className={styles.input__font}>Choose Location</span>
            <Image src='/imgs/iconsearch.svg' width='16' height='16' alt='' />
        </div>
    )
}

const MainDemoSearchBar = () => {
    const router = useRouter();
    const [searchData, setSearchData] = useState({
        search: "",
        propertyType: "house",
        maxPrice: "400000"
    })

    const handleDemoSearch = () => {
        const urlParams = new URLSearchParams(searchData);
        router.push('/dashboard?isDemo=true&' + urlParams);
    }

    return (
        <div className={styles.container}>
            <div className={styles.search__item}>
                <div className={styles.label}>
                    <Image src='/imgs/searchicon1.svg' width='16' height='16' alt='' />
                    <span className={styles.small__text}>Location</span>
                </div>
                <LocationInput value={searchData.search} setValue={(newValue: string) => setSearchData({...searchData, search: newValue})} />
            </div>
            <div className={styles.item}></div>
            <div className={styles.search__item}>
                <div className={styles.label}>
                    <Image src='/imgs/searchicon2.svg' width='16' height='16' alt='' />
                    <span className={styles.small__text}>Property Type</span>
                </div>
                <select className={`${styles.lower} ${styles.select} ${styles.text__pointer}`} value={searchData.propertyType} onChange={(event => setSearchData({...searchData, propertyType: event.target.value}))}>
                    <option selected value="house">House</option>
                    <option selected value="apartment">Apartment</option>
                </select>
            </div>
            <div className={styles.item}></div>
            <div className={`${styles.item__nonborder} ${styles.search__item}`}>
                <div className={styles.label}>
                    <Image src='/imgs/searchicon3.svg' width='16' height='16' alt='' />
                    <span className={styles.small__text}>Pricing</span>
                </div>
                <select className={`${styles.lower} ${styles.select} ${styles.text__pointer}`} value={searchData.maxPrice} onChange={(event => setSearchData({...searchData, maxPrice: event.target.value}))}>
                    <option  value="200000">$50,000 {'->'} $200,000</option>
                    <option selected value="400000">$200,000 {'->'} $400,000</option>
                    <option  value="600000">$400,000 {'->'} $600,000</option>
                    <option  value="-1">$600,000+</option>
                </select>
            </div>
            <div className={`${styles.search__button}`}>
                <button onClick={handleDemoSearch} className={styles.search__button__font}> <Image src='/imgs/search.svg' width='28' height='28' alt={''} /> </button>
            </div>
        </div>
    )
}

export default MainDemoSearchBar