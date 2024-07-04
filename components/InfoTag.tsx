import React from 'react'
import Image from 'next/image'
import styles from '../styles/InfoTag.module.css';
import { RealEstate } from '../shared/interfaces/RealEstate'

//multiple keys can represent the same value, so you want to make sure you check for this, in the return
const possibleTags: any = {
    swimming_pool: ["Pool", "/imgs/pool.svg"],
    pool: ["Pool", "/imgs/pool.svg"],
    community_swimming_pool: ["Pool", "/imgs/pool.svg"],
    fireplace: ["Fireplace", "/imgs/fireplace.svg"],
    mountain_view: ["Views", "/imgs/views.svg"],
    view: ["Views", "/imgs/views.svg"],
    views: ["Views", "/imgs/views.svg"],
    hill_or_mountain_view: ["Views", "/imgs/views.svg"],
    water_view: ["Waterfront", "/imgs/waterfront.svg"],
    lake_view: ["Waterfront", "/imgs/waterfront.svg"],
    waterfront: ["Waterfront", "/imgs/waterfront.svg"],
    basement: ["Basement", "/imgs/basement.svg"],
    trails: ["Trails", "/imgs/trails.svg"],
    shopping: ["Shopping", "/imgs/shopping.svg"],
    tennis_court: ["Tennis Court", "/imgs/tennis.svg"],
    tennis: ["Tennis Court", "/imgs/tennis.svg"],
    golf_course: ["Golf Course", "/imgs/golf.svg"],
    golf: ["Golf Course", "/imgs/golf.svg"],
}
//turn 

const InfoTag: React.FC<{ selectedProperty: RealEstate, type: string }> = ({ selectedProperty, type }) => {
    const tags = selectedProperty?.house?.tags;
    if (tags === undefined || tags === null) return <></>

    const existingTags = tags?.map((tag) => {
        if (possibleTags[tag] !== undefined) {
            return possibleTags[tag]
        }
    });
    const uniques = new Map();
    for (let i = 0; i < existingTags.length; i++) {
        if (existingTags[i] !== undefined) {
            if (!uniques.has(existingTags[i][0])) {
                uniques.set(existingTags[i][0], existingTags[i][1]);
            }
        }
    }
    console.log(uniques, 'uniques')
    const keys = Array.from(uniques.keys());
    if (type === 'beds') {
        return (
            <div className={styles.flex}>
                <Image alt='' src='/imgs/bed.svg' width='10' height='10' />
                <div className={styles.font}>
                    {selectedProperty?.house?.description?.beds} Bed
                </div>
            </div>
        )
    }
    if (type === 'baths') {
        return (
            <div className={styles.flex}>
                <Image alt='' src='/imgs/bath.svg' width='10' height='10' />
                <div className={styles.font}>
                    {selectedProperty?.house?.description?.baths} Bath
                </div>
            </div>
        )
    }
    if (type === 'sqft') {
        return (
            <div className={styles.flex}>
                <Image alt='' src='/imgs/sqft.svg' width='10' height='10' />
                <div className={styles.font}>
                    {selectedProperty?.house?.description?.sqft} sqft
                </div>
            </div>
        )
    }
    //if type is amenities
    return (
        <>
            {keys.map((key: any, index: number) => {
                return (
                    <div className={styles.flex} key={index}>
                        <Image src={uniques.get(key)} alt='Icon Missing' width='10' height='10' />
                        <div className={styles.font}>{key}</div>
                    </div>
                )
            })}
        </>
    )
}

export default InfoTag