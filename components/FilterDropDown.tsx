import React, { FC, useState } from 'react'
import styles from '../styles/FilterDropDown.module.css';
import DropDownItem from './DropDownItem';
import Image from 'next/image';
import Modal from 'react-modal';
import LargeToggle from './LargeToggle';
import { Filters } from '../shared/interfaces/Filters.d';
import DaysOnMarket from './DaysOnMarket';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        maxWidth: "411px",
        minHeight: "575px",
        padding: "29px 38px 21px 24px",
        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px"
    }
}

Modal.setAppElement('#__next');

const FilterDropdown: FC<{ options: string[], isModal?: boolean, filters: Filters, handleChange: any, filterKey?: string }> = ({ options, isModal = false, filters, handleChange, filterKey }) => {
    const [selected, setSelected] = useState(options[0]);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState(filters);
    React.useEffect(() => {
        setTempFilters(filters)
    }, [filters])
    const handleDropDownChange = (newValue: any, key: string) => {
        handleChange({ [key]: newValue });
    }

    //--modal functions

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setTempFilters(filters);
        setIsOpen(false);
    }
    const handleApplyClick = () => {
        handleChange(tempFilters);
        setIsOpen(false);
    }
    const onClick = () => {
        openModal()
    }
    //--end modal functions

    const toggleDropDown = () => {
        setIsDropDownOpen(!isDropDownOpen)
    }

    const handleTempFilterChange = (value: any, key: string) => {
        setTempFilters((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    if (isModal) {
        console.log(filters, "filters")
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
                    <div>
                        <p className={styles.small__font__modal} style={{ color: "#999999" }}>More Filters</p>
                        <div className={styles.modal__layout}>
                            <div className={styles.modal__flex}>
                                <span>Has HOA Fee</span>
                                <LargeToggle handleClick={handleTempFilterChange} filters={filters} filterKey='hasHoaFees' />
                            </div>
                            <div className={styles.bb__container}>
                                <div className={styles.bb}>
                                    <Image src='/imgs/bedmodal.svg' width='19' height='19' alt='' />
                                    <span className={styles.modal__font}>Bed</span>
                                    <select value={tempFilters?.minBeds} onChange={e => handleTempFilterChange(parseInt(e.target.value), "minBeds")}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6+</option>
                                    </select>
                                </div>
                                <div className={styles.bb}>
                                    <Image src='/imgs/bathmodal.svg' width='17' height='17' alt='' />
                                    <span className={styles.modal__font}>bath</span>
                                    <select value={tempFilters?.minBaths} onChange={e => handleTempFilterChange(parseInt(e.target.value), "minBaths")}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6+</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.modal__hoa}>
                                <span className={styles.modal__grey}>HOA Max</span>
                                <select className={styles.hoa} value={tempFilters?.hoaMax} onChange={e => handleTempFilterChange(e.target.value, "hoaMax")}>
                                    <option value="">No Limit</option>
                                    <option value="100">100/month</option>
                                    <option value="200">200/month</option>
                                    <option value="300">300/month</option>
                                    <option value="400">400/month</option>
                                    <option value="500">500/month</option>
                                    <option value="800">800/month</option>
                                    <option value="1000">1000/month</option>
                                </select>
                            </div>
                            <div className={styles.modal__flex}>
                                <span>Reduced Price</span>
                                <LargeToggle handleClick={handleTempFilterChange} filters={filters} filterKey='reducedPrice' />
                            </div>
                            <div className={styles.modal__flex}>
                                <span>Hide Foreclosure</span>
                                <LargeToggle handleClick={handleTempFilterChange} filters={filters} filterKey='hideForeclosure' />
                            </div>
                            <div className={styles.zipcode}>
                                <span>Zipcode</span>
                                <input placeholder="20013" value={tempFilters?.zipCode} onChange={e => handleTempFilterChange(e.target.value, "zipCode")} />
                            </div>
                            <div className={styles.days}>
                                <span>Days on market</span>
                                <DaysOnMarket value={tempFilters?.daysOnMarket} onChange={(value: any) => handleTempFilterChange(value, "daysOnMarket")} />
                            </div>
                            <div className={styles.apply}>
                                <button onClick={handleApplyClick}>Apply</button>
                            </div>
                        </div>
                    </div>
                </Modal>
                <div className={styles.container}>
                    <div onClick={onClick} className={styles.dropdown__header__modal} >
                        More Filters
                        <Image className={styles.image} src='/imgs/arrow_down.svg' alt='' width='10' height='6' />
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={styles.container}>
            <div onClick={toggleDropDown} className={styles.dropdown__header}>
                Type: <span className={styles.bold}>{selected}</span>
                <Image className={styles.image} src='/imgs/arrow_down.svg' alt='' width='10' height='6' />
            </div>
            {isDropDownOpen ? <div className={styles.dropdown}>
                {options.map((option, index) => {
                    return (
                        <DropDownItem key={index} isSelected={selected === option} value={option} onClick={(value: string) => handleDropDownChange(value, filterKey as string)} setSelected={setSelected} toggleDropDown={toggleDropDown}>
                            <span>{option}</span>
                        </DropDownItem>
                    )
                })
                }
            </div> : <></>}
        </div>
    )
}

export default FilterDropdown