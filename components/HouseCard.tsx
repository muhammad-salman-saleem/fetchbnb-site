import React, { FC, useContext } from 'react'
import Image from 'next/image'
import styles from '../styles/HouseCard.module.css'
import { RealEstate } from '../shared/interfaces/RealEstate'
import { useRouter } from 'next/router'
import ClipLoader from "react-spinners/ClipLoader";
import { FilterContext } from '../contexts/FiltersContext';
import PouchDB from 'pouchdb'
import { numberWithCommas } from '../shared/calculations';
var db = new PouchDB('properties');

const checkIfNull = (x: any) => {
    if (x === null || x === undefined || x === "" || x === 0) return "N/A"
    return x
}

const daysInMonth = (x: any) => {
    if (x === undefined || x === null) return 0;
    return Math.round((x / 100) * 30);
}

const estRevenue = (nightlyRate: number, occ: number) => {
    if (nightlyRate === undefined || occ === undefined) return 0;
    return daysInMonth(occ) * nightlyRate;
}

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const dotColors = {
    red: "#E7493F",
    yellow: "#FBCA4C",
    green: "#1BBD3F"

}

const LoadingHouseCard: FC = () => {
    return (
        <div className={styles.loading}>
            <ClipLoader></ClipLoader>
        </div>
    )
}

const HouseCard: FC<{ property?: RealEstate, loading?: boolean }> = ({ property, loading }) => {
    const router = useRouter();
    const house = property?.house;
    const [filters, setFilters] = useContext(FilterContext);

    if (loading) {
        return <LoadingHouseCard />
    }

    if (house === undefined) {
        return null;
    }

    let str = undefined;
    if (property?.str !== undefined) {
        str = property?.str?.content;
    }
    const isDemo = router.query?.isDemo;
    let isDemoQuery = ""
    if (isDemo !== undefined) {
        isDemoQuery = "?isDemo=true"
    }
    const handleCardClick = () => {
        db.get(house?.listing_id).then((doc) => {
            router.push(`/dashboard/${house?.listing_id}${isDemoQuery}`);
        }).catch((err) => {
            if (err) {
                let id = house?.listing_id;
                if (id === undefined) {
                    id = makeid(20);
                }
                const doc = {
                    _id: id,
                    ...property
                }
                db.put(doc).then(() => {
                    console.log(filters, "filters from houseCard")
                    router.push(`/dashboard/${id}${isDemoQuery}`);
                })
            }
        })

    }

    let decidedDotColor = dotColors.yellow;
    if (property?.estCashflow !== undefined) {
        if (property?.estCashflow > 14_000) {
            decidedDotColor = dotColors.green;
        } else if (property?.estCashflow > 0) {
            decidedDotColor = dotColors.yellow;
        } else {
            decidedDotColor = dotColors.red;
        }
    }
    let priceDotColor = dotColors.yellow;
    if (property?.str?.content?.median_rental_income !== undefined) {
        if (property?.str?.content.median_rental_income > 5_000) {
            priceDotColor = dotColors.green;
        } else if (property?.str?.content.median_rental_income > 0) {
            priceDotColor = dotColors.yellow;
        } else {
            priceDotColor = dotColors.red;
        }
    }

    const daysOnMarket = Math.floor(Math.abs((new Date(Date.now()) as any) - (new Date(house?.list_date) as any)) / (1000 * 60 * 60 * 24));
    return (
        <div className={styles.wrapper} onClick={handleCardClick} id={property?.house?.property_id}>
            <div className={styles.image__container}>
                <div className={styles.total__dot} style={{ background: decidedDotColor }}></div>
                {daysOnMarket !== 0 ? <div className={styles.market__days__font}>{daysOnMarket} {daysOnMarket === 1 ? "Day" : "Days"} on market</div> : <></>}
                <Image className={styles.house__image} src={house?.primary_photo?.href} width='281' height='166' alt='' />
            </div>
            <div className={styles.lower}>
                <div className={styles.info__fonts}>
                    <span className={styles.address}>{house?.location?.address?.line?.toString()}</span>
                    <span className={styles.city__state}>{house?.location?.address?.city}, {house?.location?.address?.state_code} {house?.location?.address?.postal_code}</span>

                </div>
                <div className={styles.info__fonts}>
                    <div className={styles.price__container}>
                        <div className={styles.price__dot} style={{ background: priceDotColor }}></div>
                        <span className={styles.price}>{(checkIfNull(house?.list_price)) ? '$' + numberWithCommas(house?.list_price) : <ClipLoader size='10' />}</span>
                    </div>
                    <div className={styles.right__title__container}>
                        <span className={styles.right__title}>Listing Price</span>
                        {/* &nbsp;
                        <span className={styles.right__title__desc}>Est. Revenue</span> */}
                    </div>
                </div>
            </div>
            <div className={styles.pricing}>
                <div>
                    <span className={styles.tagline}>STR EST.</span>
                    <div className={styles.tag__flex}>
                        <span className={styles.tagtitle}>Booked</span>
                        <span className={styles.tagdata}>{checkIfNull(daysInMonth(str?.median_occupancy_rate))}{!(checkIfNull(daysInMonth(str?.median_occupancy_rate)) === "N/A") ? "/d" : ""}</span>
                        <span className={styles.tagtitle}>Daily Rate</span>
                        <span className={styles.tagdata}>{(!(checkIfNull(str?.median_night_rate) === "N/A") ? '$' + checkIfNull(str?.median_night_rate) : "N/A")}</span>
                    </div>
                </div>
            </div>
            <hr className={styles.hr} />
            <div className={styles.quick}>
                <div className={styles.chips}>
                    <div className={styles.chip}>
                        <Image src='/imgs/bedc.svg' width='10' height='10' alt='' />
                        &nbsp;
                        {house?.description?.beds} Bed
                    </div>
                    <div className={styles.chip}>
                        <Image src='/imgs/bathc.svg' width='10' height='10' alt='' />
                        &nbsp;
                        {house?.description?.baths} Bath
                    </div>
                    <div className={styles.chip}>
                        <Image src='/imgs/sqftc.svg' width='10' height='10' alt='' />
                        &nbsp;
                        {house?.description?.sqft} sqft
                    </div>
                </div>
                <button className={styles.view__btn}>View</button>
            </div>
        </div>
    )
}

export default HouseCard