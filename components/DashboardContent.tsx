import React, { useContext } from 'react';
import { RealEstateContext } from '../contexts/RealEstate';
import styles from '../styles/DashboardContent.module.css';
import Image from 'next/image';
import HouseCard from './HouseCard';
import { RealEstate } from '../shared/interfaces/RealEstate';
import { Filters } from '../shared/interfaces/Filters.d';
import PouchDB from 'pouchdb'
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';

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
        maxWidth: "550px",
        padding: "27px",
        borderRadius: "6px",
        background: '#FAFAFA',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'auto',
    }
}

const DashboardContent: React.FC<{ filters: Filters, handleChange: any; title: string; searchIsLoading: boolean }> = ({ filters, handleChange, title, searchIsLoading }) => {
    const router = useRouter();
    const [realEstate, setRealEstate] = useContext(RealEstateContext);
    const [bookMarked, setBookMarked] = React.useState<any>([]);
    const [isOpen, setIsOpen] = React.useState(false);

    const stateCode = realEstate?.realEstate[0]?.house?.location?.address?.state_code;
    const city = realEstate?.realEstate[0]?.house?.location?.address?.city;


    const openBookmarkModal = () => {
        db.allDocs({
            include_docs: true,
            attachments: true

        }).then(function (results: any) {
            setBookMarked(results);
            console.log(results, "ahh")
        })
    }

    //--modal functions

    function openModal() {
        setIsOpen(true);
    }


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    const onClick = () => {
        openModal()
        openBookmarkModal()
    }
    //--end modal functions

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal" //itdas
                overlayClassName={"overlay"}
            >
                <div>
                    <div className={styles.heart__container}>
                        <Image alt='' src='/imgs/hearticon.svg' width='14' height='14' />
                        <span className={styles.heart__bold}>Bookmarked Properties</span>
                    </div>
                    <hr className={styles.heart__hr} />
                    <div className={styles.container}>
                        {bookMarked?.rows?.map((item: any, key: number) => {
                            return (
                                <div key={key}>
                                    <div className={styles.popup}>
                                        <Image
                                            className={styles.popup_image}
                                            alt=''
                                            src={item?.doc?.house?.primary_photo?.href}
                                            width='84'
                                            height='68'
                                        />
                                        <div className={styles.popdata}>
                                            <div>
                                                <p className={styles.address__line}>{item?.doc?.house?.location?.address?.line?.toString()}</p>
                                                <p className={styles.subaddress}>{item?.doc.house?.location?.address?.city}, {item?.doc.house?.location?.address?.state_code} {item?.doc.house?.location?.address?.postal_code}</p>
                                                <p className={styles.underprices}>{item?.doc?.house?.list_price}&nbsp;&nbsp;&nbsp;{item?.doc.house?.description?.beds} bd, {item?.doc.house?.description?.baths} ba</p>
                                            </div>
                                            <button className={styles.popup__button} onClick={() => router.push('/dashboard/' + item?.doc?.house?.listing_id)}>View</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Modal>
            <div className={styles.layout}>
                <div className={styles.dashboard__header}>
                    <div className={styles.header__item}>
                        <h4>{title} Properties</h4>
                        <div className={styles.header__controls}>
                            <button className={styles.bookmark__button} onClick={onClick}>
                                <span className={styles.favs__font}>Favorites</span>&nbsp; <Image alt='' src='/imgs/hearticon.svg' width='14' height='14' />
                            </button>
                        </div>
                    </div>
                    <div className={styles.header__item__bottom}>
                        <div className={styles.small__font}>109 properties</div>
                        <div className={styles.sort}>
                            <span>Sort By:</span>
                            <select value={filters.sort} onChange={(e: any) => handleChange({ sort: e.target.value })}>
                                <option value='relevant'>Relevant</option>
                                <option value='newest'>Newest</option>
                                <option value='lowest_price'>Lowest Price</option>
                                <option value='highest_price'>Highest Price</option>
                                <option value='open_house_date'>Open House Date</option>
                                <option value='price_reduced_date'>Price Reduced Date</option>
                                <option value='largest_sqft'>Largest sqft</option>
                                <option value='lot_size'>Lot Size</option>
                                <option value='sold_date'>Sold Date</option>
                            </select>
                        </div>
                    </div>
                </div>
                {realEstate.realEstate.length !== 0 ?
                    <>
                        <div className={styles.dashboard__content}>
                            {
                                // loop through every other real estate property
                                realEstate.realEstate.map((property: RealEstate, index: number) => {
                                    console.log(property, "property");
                                    if (index % 2 === 0) {
                                        return (
                                            <div key={index} className={styles.housecard__flex}>
                                                <HouseCard property={property} />
                                                <HouseCard property={realEstate.realEstate[index + 1]} />
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        {searchIsLoading && realEstate.realEstate.length <= 40 ? <div className={styles.loadingmore}>
                            <span>More Properties Loading...</span>
                            <ClipLoader></ClipLoader>
                        </div> : <></>}
                    </>
                    :
                    <div className={styles.dashboard__content}>
                        <HouseCard loading />
                    </div>
                }
            </div>
        </>
    )
}

export default DashboardContent