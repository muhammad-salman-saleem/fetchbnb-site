import React, { useContext, useState, useEffect } from 'react'
import { RealEstateContext, DefaultRealEstateType } from '../contexts/RealEstate';
import { useRouter } from 'next/router';
import { RealEstate } from '../shared/interfaces/RealEstate';
import styles from '../styles/SelectedContent.module.css';
import Image from 'next/image';
import Modal from 'react-modal';
import InfoTag from './InfoTag';
import MoreFiltersInnerModal from './MoreFiltersInnerModal';
import EditStrModal from './EditStrModal';
import { ExtraInfo } from '../shared/interfaces/ExtraInfo';
import OrdinanceModal from './OrdinanceModal';
import { FilterContext } from '../contexts/FiltersContext';
import Link from "next/link";
import PouchDB from 'pouchdb'
var db = new PouchDB('bookmarks');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        zIndex: '1000',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        maxWidth: "411px",
        minHeight: "575px",
        padding: "29px 38px 21px 24px",
        borderRadius: "6px",
        background: '#FAFAFC',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
    }
}
const customStylesStr = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        zIndex: '1000',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        maxWidth: "379px",
        padding: "19px 19px 27px 29px",
        borderRadius: "6px",
        background: '#FAFAFC',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
    }
}
const customStylesOrd = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        zIndex: '1000',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        maxWidth: "379px",
        padding: "19px 19px 27px 29px",
        overflow: 'hidden',
        background: "#FAFAFC",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.15)",
        borderRadius: "6px"
    }
}

Modal.setAppElement('#__next');


const dotColors = {
    red: "#E7493F",
    yellow: "#FBCA4C",
    green: "#1BBD3F"

}


const generatePermaLink = (x: string) => {
    return x.replace(/_[^_]*$/, "").replace(/_/g, '-');
}

const daysInMonth = (x: number | undefined) => {
    console.log(x, "x")
    if (x === undefined || x === null || x === 1) return "N/A";
    return Math.round((x / 100) * 30);
}

function numberWithCommas(x: number | undefined) {
    if (x === undefined) return "N/A";
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const CompareAvgs: React.FC<{ current: number | undefined, averages: any, type: string }> = ({ current, averages, type }) => {
    if (current === undefined) return <></>;
    if (averages === undefined) return <></>;
    if (type === 'rev') {
        const average = averages.averageRevenue.average;
        if (current < average) {
            return (
                <span className={styles.trend}>${average - current} lower than usual <Image quality='100' alt='' src='/imgs/trending_down.svg' width='10' height='10' /></span>
            )
        }
        if (current > average) {
            return (
                <span className={styles.trend}>${current - average} greater than usual</span>
            )
        }
        return <></>;
    }
    if (type === 'occ') {
        const average = averages.averageOcc.average;
        if (current < average) {
            return (
                <span className={styles.trend}>{daysInMonth(average - current)} days lower than usual <Image quality='100' alt='' src='/imgs/trending_down.svg' width='10' height='10' /></span>
            )
        }
        if (current > average) {
            return (
                <span className={styles.trend}>{daysInMonth(current - average)} days greater than usual</span>
            )
        }
        return <></>;
    }
    if (type === 'adr') {
        const average = averages.averageDailyRate.average;
        if (current < average) {
            return (
                <span className={styles.trend}>${average - current} lower than usual <Image quality='100' alt='' src='/imgs/trending_down.svg' width='10' height='10' /></span>
            )
        }
        if (current > average) {
            return (
                <span className={styles.trend}>${current - average} greater than usual</span>
            )
        }
        return <></>;
    }
    return <></>
}

const SelectedContent: React.FC<{ selectedProperty: RealEstate }> = ({ selectedProperty }) => {
    const router = useRouter()
    const { listingId } = router.query
    const [realEstate, setRealEstate] = useContext(RealEstateContext);
    const [filters, setFilters] = useContext(FilterContext);
    const [ordText, setOrdText] = useState("Request Ordinance");
    const [values, setValues] = useState({
        interestRate: 6,
        downPayment: 20,
        termLength: '30',
        landLord: '',
        propertyTaxes: '',
        hoaFees: '',
        estMaintenance: '',
        propertyManagementFee: '',
        MortageExpenses: '', //this will need a default value & calculation
        utilities: '',
        annualOther: '',
        estimatedHomeInsurance: '',
        homeFurnishing: '',
        improvements: '',
        closingCosts: '',
        startupOtheer: '',
        cashFlow: '',
    });
    const [strValues, setStrValues] = useState({
        dailyRate: selectedProperty?.str?.content?.median_night_rate,
        booked: selectedProperty?.str?.content?.median_occupancy_rate,
        estRev: (selectedProperty?.str?.content?.median_night_rate as number) * (daysInMonth(selectedProperty?.str?.content?.median_occupancy_rate) as number),
    });
    const [currentAverages, setAverages] = useState({
        averageRevenue: { value: 0, count: 0, average: 0 },
        averageOcc: { value: 0, count: 0, average: 0 },
        averageDailyRate: { value: 0, count: 0, average: 0 }
    });
    const [modalIsOpen, setIsOpen] = useState(false);
    const [strModalIsOpen, setStrIsOpen] = useState(false);
    const [ordIsOpen, setOrdIsOpen] = useState(false);
    const [missingOrdIsOpen, setMissingOrdIsOpen] = useState(false);
    const [isCashFlowCalculated, setIsCashFlowCalculated] = useState(false);
    const [isBookMarked, setIsBookMarked] = useState(false);

    const [extraInfo, setExtraInfo] = useState<any>(undefined);
    const [ltrDotColor, setLtrDotColor] = useState(dotColors.yellow);

    useEffect(() => {
        setStrValues({
            dailyRate: selectedProperty?.str?.content?.median_night_rate,
            booked: selectedProperty?.str?.content?.median_occupancy_rate,
            estRev: (selectedProperty?.str?.content?.median_night_rate as number) * (daysInMonth(selectedProperty?.str?.content?.median_occupancy_rate) as number),
        })
        const grabData = async () => {
            const isDemo = router.query?.isDemo;
            let isDemoQuery = ""
            if (isDemo !== undefined) {
                isDemoQuery = "?isDemo=true"
            }
            const res = await fetch('/api/extrastats' + isDemoQuery,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        city: selectedProperty?.house?.location?.address?.city,
                        zip: selectedProperty?.house?.location?.address?.postal_code,
                        line: selectedProperty?.house?.location?.address?.line,
                        stateCode: selectedProperty?.house?.location?.address?.state_code,
                        beds: selectedProperty?.house?.description?.beds,
                        baths: selectedProperty?.house?.description?.baths,
                        sqft: selectedProperty?.house?.description?.sqft,
                        county: selectedProperty?.house?.location?.county,
                        coords: { lat: selectedProperty?.house?.location?.address?.coordinate.lat, lng: selectedProperty?.house?.location?.address?.coordinate.lon }
                    })
                }
            );
            const data = await res.json();
            console.log(data, "extra")
            setExtraInfo(data);
            setLtrDotColor(dotColors.green);
        }
        grabData();
    }, [selectedProperty])

    //--modal functions

    function openModal() {
        setIsOpen(true);
    }

    function openStrModal() {
        setStrIsOpen(true);
    }

    function openOrdModal() {
        setOrdIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
        setStrIsOpen(false);
        setOrdIsOpen(false);
        setMissingOrdIsOpen(false);
    }
    const onClick = () => {
        openModal()
    }
    //--end modal functions

    const daysOnMarket = Math.floor(Math.abs((new Date(Date.now()) as any) - (new Date(selectedProperty?.house?.list_date) as any)) / (1000 * 60 * 60 * 24));
    console.log(selectedProperty, "selected")
    const loadImages = () => {
        let image1;
        let image2;
        if (selectedProperty?.house?.photos === null) {
            console.log("no photos")
            return ['', ''];
        }
        if (selectedProperty?.house?.photos.length >= 2) {
            console.log("two photos");
            image1 = selectedProperty?.house?.photos[0]?.href;
            image2 = selectedProperty?.house?.photos[1]?.href;
            return [image1, image2];
        }
        return ['', ''];
    }

    const [images, setImages] = useState(loadImages());

    const handleImageClick = () => {
        setImages((prev => [prev[1], prev[0]]));
    }

    const randomProperties = () => {
        // generate two different random properties, that do not match the current selectedProperty
        const randomProperty1 = realEstate.realEstate[Math.floor(Math.random() * realEstate.realEstate.length)];
        let randomProperty2 = realEstate.realEstate[Math.floor(Math.random() * realEstate.realEstate.length)];
        while (randomProperty1?.house?.listing_id === randomProperty2?.house?.listing_id && randomProperty1?.house?.listing_id !== undefined && randomProperty2?.house?.listing_id !== undefined) {
            randomProperty2 = realEstate.realEstate[Math.floor(Math.random() * realEstate.realEstate.length)];
        }
        return [randomProperty1, randomProperty2];
    }

    const [random, setrandomProperties] = useState(randomProperties());
    const [randomProperty1, randomProperty2] = random;

    useEffect(() => {
        setImages(loadImages());
        setrandomProperties(randomProperties());
    }, [listingId, selectedProperty])

    useEffect(() => {
        if (!(selectedProperty?._id === undefined)) return; //if loading from local db, do not run calc because lack of state
        const averages = {
            averageRevenue: { value: 0, count: 0, average: 0 },
            averageOcc: { value: 0, count: 0, average: 0 },
            averageDailyRate: { value: 0, count: 0, average: 0 }
        }
        realEstate.realEstate.every((property: RealEstate) => {
            const rev = property?.str?.content?.adjusted_rental_income;
            if (rev === undefined || rev === null) return false;
            averages.averageRevenue.value += rev;
            averages.averageRevenue.count += 1;

            const occ = property?.str?.content?.median_occupancy_rate;
            if (occ === undefined || occ === null) return false;
            averages.averageOcc.value += occ;
            averages.averageOcc.count += 1;

            const dailyRate = property?.str?.content?.median_night_rate;
            if (dailyRate === undefined || dailyRate === null) return false;
            averages.averageDailyRate.value += dailyRate;
            averages.averageDailyRate.count += 1;

            return true;
        });
        averages.averageRevenue.average = Math.round(averages.averageRevenue.value / averages.averageRevenue.count);
        averages.averageOcc.average = Math.round(averages.averageOcc.value / averages.averageOcc.count);
        averages.averageDailyRate.average = Math.round(averages.averageDailyRate.value / averages.averageDailyRate.count);
        console.log(averages, "AVERAGES")
        setAverages(averages);
    }, [realEstate.realEstate])

    const handleSimilarClick = (id: any) => {
        router.push('/dashboard/' + id);
    }
    const calculateMortageExpense = () => {
        const apr = values.interestRate / 1200;
        const term = parseInt(values.termLength) * 12;
        const forSalePrice = selectedProperty?.house.list_price;
        const amt = forSalePrice - (forSalePrice * (values.downPayment / 100));
        const mortgageExpense = (Math.round(amt * (apr * Math.pow((1 + apr), term)) / (Math.pow((1 + apr), term) - 1)));

        //if a value is === '' then set the value to 0 
        const landLord = values.landLord === '' ? 0 : parseInt(values.landLord);
        const propertyTaxes = values.propertyTaxes === '' ? 0 : parseInt(values.propertyTaxes);
        const hoaFees = values.hoaFees === '' ? 0 : parseInt(values.hoaFees);
        const estMaintenance = values.estMaintenance === '' ? 0 : parseInt(values.estMaintenance);
        const propertyManagementFee = values.propertyManagementFee === '' ? 0 : parseInt(values.propertyManagementFee);
        const utilities = values.utilities === '' ? 0 : parseInt(values.utilities);
        const annualOther = values.annualOther === '' ? 0 : parseInt(values.annualOther);
        const homeFurnishing = values.homeFurnishing === '' ? 0 : parseInt(values.homeFurnishing);
        const improvements = values.improvements === '' ? 0 : parseInt(values.improvements);
        const closingCosts = values.closingCosts === '' ? 0 : parseInt(values.closingCosts);
        const startupOtheer = values.startupOtheer === '' ? 0 : parseInt(values.startupOtheer);
        const strRev = strValues?.estRev === undefined ? 0 : strValues.estRev;
        console.log(strRev, "STRREV")
        console.log(((mortgageExpense * 12) + landLord + propertyTaxes + hoaFees + estMaintenance + propertyManagementFee + utilities + annualOther + homeFurnishing + improvements + closingCosts + startupOtheer), "AA")
        const cashFlow = ((strRev * 12) - ((mortgageExpense * 12) + landLord + propertyTaxes + hoaFees + estMaintenance + propertyManagementFee + utilities + annualOther + homeFurnishing + improvements + closingCosts + startupOtheer));
        setValues({ ...values, cashFlow: cashFlow.toString(), MortageExpenses: mortgageExpense.toString() })
    }

    useEffect(() => {
        calculateMortageExpense();

    }, [strValues, selectedProperty, values.downPayment, values.interestRate, values.termLength, values.landLord, values.propertyTaxes, values.hoaFees, values.estMaintenance, values.propertyManagementFee, values.utilities, values.annualOther, values.homeFurnishing, values.improvements, values.closingCosts, values.startupOtheer])


    let cashFlowDotColor = dotColors.yellow;
    if (values.cashFlow !== undefined) {
        if (parseInt(values.cashFlow) > 14_000) {
            cashFlowDotColor = dotColors.green;
        } else if (parseInt(values.cashFlow) > 0) {
            cashFlowDotColor = dotColors.yellow;
        } else {
            cashFlowDotColor = dotColors.red;
        }
    }

    let priceDotColor = dotColors.yellow;
    if (strValues.estRev !== undefined) {
        if (strValues.estRev > 2_000) {
            priceDotColor = dotColors.green;
        } else if (strValues.estRev > 0) {
            priceDotColor = dotColors.yellow;
        } else {
            priceDotColor = dotColors.red;
        }
    }

    const [bookingDotColor, setBookingDotColor] = useState(dotColors.yellow)
    useEffect(() => {
        if (strValues.booked !== undefined) {
            console.log(strValues.booked, "BOOKED")
            if (strValues.booked > 67) {
                setBookingDotColor(dotColors.green);
            } else if (strValues.booked > 0) {
                setBookingDotColor(dotColors.yellow);
            } else {
                setBookingDotColor(dotColors.red);
            }
        }
    }, [strValues.booked])

    const [dailyRateDotColor, setDailyRateDotColor] = useState(dotColors.yellow)
    useEffect(() => {
        if (strValues.dailyRate !== undefined) {
            console.log(strValues.dailyRate, "BOOKED")
            if (strValues.dailyRate > 200) {
                setDailyRateDotColor(dotColors.green);
            } else if (strValues.dailyRate > 100) {
                setDailyRateDotColor(dotColors.yellow);
            } else {
                setDailyRateDotColor(dotColors.red);
            }
        }
    }, [strValues.dailyRate])

    const propertyUrl = filters.filters?.investorType.toLowerCase() === "purchase" ? `https://www.zillow.com/homes/${generatePermaLink(selectedProperty?.house?.permalink !== undefined ? selectedProperty?.house?.permalink : "")}` : `https://www.realtor.com/realestateandhomes-detail/${selectedProperty?.house?.permalink}`;
    const bookmarkProperty = () => {
        const { listingId } = router.query
        setIsBookMarked(true);
        db.get(listingId as string).then((doc) => {
            console.log("already added")
        }).catch((err) => {
            if (err) {
                db.put({
                    _id: listingId,
                    ...selectedProperty
                })
            }
        })
    }


    const requestOrd = () => {
        if (location === undefined) return;
        console.log(selectedProperty)
        fetch('/api/requestzoning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    state: selectedProperty?.house?.location?.address?.state_code,
                    county: selectedProperty?.house?.location?.address?.county?.name
                }
            ),
        }).then((response) => response.json()).then((data) => {
            if (data.status !== 200) {
                console.log("Error with real estate data:", data)
            }
            setOrdText("Request Sent!");
            setMissingOrdIsOpen(true);
        })
    }

    console.log(extraInfo, "EXT")

    const submitMissing = async (info: string) => {
        const res = await fetch('/api/submitmissingord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(
                {
                    state: selectedProperty?.house?.location?.address?.state_code,
                    county: selectedProperty?.house?.location?.address?.county?.name ? selectedProperty?.house?.location?.address?.county?.name : "County N/A but city is " + selectedProperty?.house?.location?.address?.city,
                    info
                }
            ),
        })
        console.log({
            state: selectedProperty?.house?.location?.address?.state_code,
            county: selectedProperty?.house?.location?.address?.county?.name,
            info
        })
        const data = await res.json();
        if (data.status === 200) {
            setOrdText("Request Sent!");
            setMissingOrdIsOpen(false);
        }
        closeModal();
    }

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName={"overlay"}
            >
                <MoreFiltersInnerModal closeModal={closeModal} handleClick={() => setIsCashFlowCalculated(true)} values={values} setValues={setValues} />
            </Modal>
            <Modal
                isOpen={strModalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStylesStr}
                contentLabel="Example Modal"
                overlayClassName={"overlay"}
            >
                <EditStrModal closeModal={closeModal} values={strValues} setValues={setStrValues} />
            </Modal>
            <Modal
                isOpen={ordIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStylesOrd}
                contentLabel="Example Modal" //itdas
                overlayClassName={"overlay"}
            >
                <OrdinanceModal stateCode={selectedProperty?.house?.location?.address?.state_code} ord={extraInfo?.ordinance} />
            </Modal>
            <Modal
                isOpen={missingOrdIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStylesOrd}
                contentLabel="Example Modal" //itdas
                overlayClassName={"overlay"}
            >
                <OrdinanceModal missing submitMissing={submitMissing} />
            </Modal>
            <div className={styles.layout}>
                <div className={styles.dashboard__header}>
                    <div className={styles.header__item}>
                        <div>
                            {daysOnMarket !== 0 ? <div className={styles.small__font}><span className={styles.dayson}>{daysOnMarket}</span> Days on market</div> : <div className={styles.small__font}>Listed today</div>}
                            <h4>{selectedProperty?.house?.location?.address?.line}</h4>
                        </div>
                        <div className={styles.header__controls}>
                            <button className={styles.bookmark__button} onClick={bookmarkProperty}>
                                <Image alt='' src={isBookMarked ? '/imgs/filled_heart.svg' : '/imgs/hearticon.svg'} width='14' height='14' />
                            </button>
                        </div>
                    </div>
                    <div className={styles.header__item__bottom}>
                        <div className={styles.small__font}>{selectedProperty?.house?.location?.address?.city}, {selectedProperty?.house?.location?.address?.state_code} {selectedProperty?.house?.location?.address?.postal_code}</div>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.flex__property__info}>
                            <hr className={styles.hr} />
                            <Image className={styles.prop__img} alt='property image' src={images[0]} width='322' height='190' />
                            <div onClick={handleImageClick} className={styles.prop__img__slider}>
                                <Image className={styles.prop__img__slider__img} alt='property image' src={images[1]} width='74' height='45' />
                            </div>
                            <div className={styles.important__info}>
                                <h4 className={styles.info__price}>${numberWithCommas(selectedProperty?.house?.list_price)}</h4>
                                <div className={styles.info__btns}>
                                    {
                                        extraInfo?.ordinance !== undefined && extraInfo?.ordinance?.result.length !== 0 ? <button className={styles.ord__btn} onClick={openOrdModal}>Ordinances</button> :
                                            <button className={styles.ord__btn} onClick={requestOrd}>{ordText}</button>
                                    }
                                    <Link target="_blank" href={`${propertyUrl}`} className={styles.view__btn}>View</Link>
                                </div>
                            </div>
                            <hr className={styles.hr} />
                            <div className={styles.infotags}>
                                <InfoTag type='beds' selectedProperty={selectedProperty} />
                                <InfoTag type='baths' selectedProperty={selectedProperty} />
                                <InfoTag type='sqft' selectedProperty={selectedProperty} />
                                <InfoTag type='amenities' selectedProperty={selectedProperty} />
                            </div>
                        </div>
                        <div className={styles.side__wrapper}>
                            <div className={styles.estimated__cashflow}>
                                <div>
                                    <span className={styles.est__cash__font}>Estimated Cash Flow</span>
                                    <div className={`${styles.price__box} ${styles.margin}`}>
                                        {isCashFlowCalculated ?
                                            <h4>${numberWithCommas(parseInt(values.cashFlow))}</h4> :
                                            <button onClick={() => setIsOpen(true)} className={styles.calc__preview__button}>Calculate Cashflow</button>
                                        }
                                        {isCashFlowCalculated ? <div className={styles.price__box__circle} style={{ background: cashFlowDotColor }}></div> : <></>}
                                    </div>
                                    <span className={styles.est__subfont}><span>Click</span> to change inputs for calculator
                                        <Image alt='' src='/imgs/toparr.svg' width='5' height='6' />
                                    </span>
                                </div>
                                {isCashFlowCalculated ? <div>
                                    <Image onClick={onClick} className={styles.calc__btn} alt='' src='/imgs/phone.svg' width='22' height='22' />
                                </div> : <> </>}
                            </div>
                            <span className={styles.item__header__font}>Short Term Prediction</span>
                            <div className={styles.str__container}>
                                <div className={styles.str__top}>
                                    <div className={styles.str__top__content}>
                                        <span className={styles.side__font}>Est. Revenue</span>
                                        <div className={styles.price__box}>
                                            <h4>${numberWithCommas(strValues.estRev)}</h4>
                                            <div className={styles.price__box__circle} style={{ background: priceDotColor }}></div>
                                        </div>
                                    </div>
                                    <div className={styles.str__edit}>
                                        <span onClick={openStrModal} className={styles.str__edit__button}>Edit</span>
                                    </div>
                                </div>
                                <div>
                                    <CompareAvgs current={selectedProperty?.str?.content?.median_night_rate as number * (daysInMonth(selectedProperty?.str?.content?.median_occupancy_rate) as any)} averages={currentAverages} type='rev' />
                                </div>
                                <hr className={styles.between} />
                                <div>
                                    <div className={styles.str__top__content}>
                                        <span className={styles.side__font}>Est. Booked</span>
                                        <div className={styles.price__box}>
                                            <h4>{daysInMonth(strValues.booked)}/days</h4>
                                            <div className={styles.price__box__circle} style={{ background: bookingDotColor }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <CompareAvgs current={selectedProperty?.str?.content?.median_occupancy_rate} averages={currentAverages} type='occ' />
                                    </div>
                                </div>
                                <hr className={styles.between} />
                                <div>
                                    <div className={styles.str__top__content}>
                                        <span className={styles.side__font}>Est. Daily Rate</span>
                                        <div className={styles.price__box}>
                                            <h4>${strValues.dailyRate}/d</h4>
                                            <div className={styles.price__box__circle} style={{ background: dailyRateDotColor }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <CompareAvgs current={strValues.dailyRate} averages={currentAverages} type='adr' />
                                    </div>
                                </div>
                            </div>
                            <span className={styles.item__header__font}>Long Term Prediction</span>
                            <div className={styles.str__container}>
                                <div className={styles.str__top}>
                                    <div className={styles.ltr__top__content}>
                                        <span className={styles.side__font}>Avg. Monthly Rent</span>
                                        <div className={styles.price__box}>
                                            <h4>${Math.round(extraInfo?.ltr?.rentRangeLow)}/m</h4>
                                            <div className={styles.price__box__circle} style={{ background: ltrDotColor }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!(selectedProperty?._id) ? <div>
                        <span className={styles.similar__font}>Similar Properties</span>
                        <div className={styles.similar__properties}>
                            <div onClick={() => handleSimilarClick(randomProperty1?.house?.listing_id)} className={styles.similar}>
                                <Image className={styles.similar__img} alt='' width='244' height='144' src={randomProperty1?.house?.primary_photo?.href} />
                                <div className={styles.similar__overlay}>
                                    <Image alt='' width='284' height='144' src='/imgs/rectprop.svg' />
                                    <div className={styles.similar__fonts}>
                                        <span className={styles.similar__address}>{randomProperty1?.house?.location?.address?.line}</span>
                                        <p className={`${styles.similar__address} ${styles.sim__p}`}>{randomProperty1?.house?.location?.address?.city}, {randomProperty1?.house?.location?.address?.state_code} {randomProperty1?.house?.location?.address?.postal_code}</p>
                                        <p className={`${styles.similar__address} ${styles.sim__rev}`}>${(randomProperty1?.str?.content?.median_night_rate as number) * (randomProperty1?.str?.content?.median_occupancy_rate as number)}/m</p>
                                        <p className={`${styles.similar__address} ${styles.sim__rev__sub}`}>Est. Revenue</p>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => handleSimilarClick(randomProperty2?.house?.listing_id)} className={styles.similar}>
                                <Image className={styles.similar__img} alt='' width='244' height='144' src={randomProperty2?.house?.primary_photo?.href} />
                                <div className={styles.similar__overlay}>
                                    <Image alt='' width='284' height='144' src='/imgs/rectprop.svg' />
                                    <div className={styles.similar__fonts}>
                                        <span className={styles.similar__address}>{randomProperty2?.house?.location?.address?.line}</span>
                                        <p className={`${styles.similar__address} ${styles.sim__p}`}>{randomProperty2?.house?.location?.address?.city}, {randomProperty2?.house?.location?.address?.state_code} {randomProperty2?.house?.location?.address?.postal_code}</p>
                                        <p className={`${styles.similar__address} ${styles.sim__rev}`}>${(randomProperty2?.str?.content?.median_night_rate as number) * (randomProperty2?.str?.content?.median_occupancy_rate as number)}/m</p>
                                        <p className={`${styles.similar__address} ${styles.sim__rev__sub}`}>Est. Revenue</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
                </div>
            </div>
        </>
    )
}

export default SelectedContent