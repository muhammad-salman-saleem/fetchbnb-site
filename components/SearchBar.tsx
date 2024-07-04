import React, { useState, FC, useEffect, useContext, useRef } from 'react'
import { RealEstateContext, DefaultRealEstateType } from '../contexts/RealEstate';
import styles from '../styles/SearchBar.module.css';
import Image from 'next/image';
import { RealEstate } from '../shared/interfaces/RealEstate';
import { useRouter } from 'next/router';
import { Filters } from '../shared/interfaces/Filters.d';
import { FilterContext } from '../contexts/FiltersContext';
import { ReadOnlyContext } from '../contexts/ReadOnlyContext';
import Modal from 'react-modal';
import MoreFiltersInnerModal from "./MoreFiltersInnerModal";
import { HistoricalOverview } from '../shared/interfaces/historicalOverview';

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
        maxWidth: "770px",
        padding: "60px 136px",
        overflow: 'auto',
        background: "#FAFAFC",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.15)",
        borderRadius: "6px"
    }
}


Modal.setAppElement('#__next');


const daysInMonth = (x: any) => {
    if (x === undefined || x === null) return 0;
    return Math.round((x / 100) * 30);
}


const AutoFillItem: FC<{ handleClick: (x: any) => void; text: string; value: { city: string, stateCode: string } }> = ({
    handleClick,
    text,
    value
}) => {
    return (
        <div onClick={() => handleClick(value)} className={styles.autofill__item}>{text}</div>
    )
}

const calculateCashflow = (forSalePrice: number, strRev: number) => {
    const apr = 6 / 1200;
    const term = 30 * 12;
    const amt = forSalePrice - (forSalePrice * (20 / 100));
    const mortgageExpense = (Math.round(amt * (apr * Math.pow((1 + apr), term)) / (Math.pow((1 + apr), term) - 1)));
    return ((strRev * 12) - ((mortgageExpense * 12)));
}

const SearchBar: React.FC<{ mapToggle?: (x: any) => void; handleCustomGeoLoad: (x: string) => void; isScrolledToBottom: boolean; searchIsLoading: boolean; setSearchIsLoading: (x: boolean) => void; }> = ({ mapToggle, handleCustomGeoLoad, isScrolledToBottom, searchIsLoading, setSearchIsLoading }) => {
    const router = useRouter();

    const [filters, setFilters] = useContext(FilterContext);
    const [readOnly, setReadOnly] = useContext(ReadOnlyContext);
    const inputValue = filters.search;
    const [realEstate, setRealEstate] = useContext(RealEstateContext);
    const didMount = React.useRef(false);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [results, setResults] = useState<{ state_code: string, city: string }[] | []>([]);
    const [showDropDown, setShowDropDown] = useState(false);
    const [currentInputValue, setCurrentInputValue] = useState(filters.search + "  ");
    const [demoModal, setDemoModal] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [sortedAutoFill, setSortedAutoFill] = useState<any[]>([]);

    //--modal functions

    function openModal() {
        setDemoModal(true);
    }


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setDemoModal(false);
    }

    const outOfSearchesModal = () => {
        openModal()
    }
    //--end modal functions

    const usePrevious = (value: any) => {
        const ref = useRef<any>();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevFilters = usePrevious(filters.filters);

    const updateInputValue = (newValue: string) => {
        // setFilters({ filters: { ...filters.filters }, search: newValue })
        setSortedAutoFill(results
            ?.sort((a: any, b: any) => b["_score"] - a["_score"])
            ?.filter((value, index, self) => index === self.findIndex((t) => (t.city === value.city && t.state_code === value.state_code)))
        );
        setCurrentInputValue(newValue);
        console.log(filters, "from search filters")
    }


    const handleSelectClick = (value: { city: string, stateCode: string }) => {
        setShowDropDown(false);
        updateInputValue(`${value.city}, ${value.stateCode}`);
    }

    const handleSearch = async (typeOfSearch?: string) => {
        try {
            if (searchIsLoading) return;
            if (typeOfSearch === "scroll" && realEstate.realEstate.length >= 40) return;
            setSearchIsLoading(true);
            let res: any = undefined;
            console.log(filters, "filters from search")
            let filtersUrl = new URLSearchParams((filters.filters as any)).toString();
            const isDemo = router.query?.isDemo;
            let isDemoQuery = ""
            if (isDemo !== undefined) {
                isDemoQuery = "&isDemo=true"
            }
            if (typeOfSearch !== undefined) {
                if (router.query?.isDemo) {
                    const demoQueryParam = {
                        location: router.query?.search,
                        propertyType: router.query?.propertyType,
                        maxPrice: router.query?.maxPrice
                    }
                    filtersUrl = new URLSearchParams(({ ...filters.filters, ...demoQueryParam, isDemo: true } as any)).toString();
                    const demoInitFilters = new URLSearchParams((demoQueryParam as any)).toString();
                    res = await fetch(`/api/real-estate?${filtersUrl}`);
                } else if (typeOfSearch !== "scroll") {
                    res = await fetch(`/api/real-estate?location=Los%20Angeles%2C%20CA&${filtersUrl}${isDemoQuery}`);
                } else {
                    //scroll
                    if (realEstate.realEstate.length < 40) {
                        res = await fetch(`/api/real-estate?location=${filters.search}&max=${40 - realEstate.realEstate.length}&page=${pageNumber}&${filtersUrl}${isDemoQuery}`);
                    }
                }
            } else {
                res = await fetch(`/api/real-estate?location=${currentInputValue}&${filtersUrl}${isDemoQuery}`);
            }
            const data = await res.json();
            setSearchIsLoading(false);
            setPageNumber((prev: any) => prev + 1);
            console.log({ data }, "AWWW")
            if (res.status === 401) {
                outOfSearchesModal()
            }
            const results = data?.data?.home_search?.results;
            if (results.length === 0 || results === undefined || results == null || results?.forEach === undefined) {
                return;
            }
            handleCustomGeoLoad(`${data?.customGeo?.city}, ${data?.customGeo?.stateCode}`);
            console.log({ historicalOverview: data?.historicalOverview })
            setReadOnly((prev: any) => ({ ...prev, historicalOverview: data?.historicalOverview }))

            // if filters are for sublease... line 61 in HouseList old code
            const placeHolderResults = results.map((result: any) => {
                return { house: result }
            })

            if (typeOfSearch === "scroll") {
                setRealEstate((prev: any) => ({
                    general: { propertyCount: data?.data?.home_search?.total + prev.general.propertyCount },
                    realEstate: [...prev.realEstate, ...placeHolderResults]
                }))
            } else {
                setRealEstate({
                    general: { propertyCount: data?.data?.home_search?.total },
                    realEstate: placeHolderResults
                })
            }
            // loop through results and add str data
            const strPromises = [];
            for (const property of results) {
                let paramsStr = new URLSearchParams({
                    address: property.location.address.line !== null ? property.location.address.line.toString() : "",
                    city: property.location.address?.city === undefined || property.location.address?.city === null ? "" : property.location.address.city.toString(),
                    zip_code: property.location.address?.postal_code === undefined || property.location.address?.postal_code === null ? "" : property.location.address.postal_code.toString(),
                    state: property.location.address?.state_code === undefined || property.location.address?.state_code === null ? "" : property.location.address.state_code.toString(),
                    bedrooms: (property.description.beds === null ? "0" : property.description.beds.toString()),
                    bathrooms: (property.description.baths === null ? "0" : property.description.baths.toString()),
                })
                strPromises.push(
                    fetch(`/api/str?${paramsStr.toString()}${isDemoQuery}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data?.content?.median_night_rate === null || data?.content?.median_occupancy_rate === null) {
                                setRealEstate((prevFetched: DefaultRealEstateType) => {
                                    const newState = prevFetched.realEstate
                                        .filter((fetched: RealEstate) => {
                                            if (fetched?.house?.property_id === property?.property_id) {
                                                return false
                                            }
                                            return true
                                        })
                                    return { ...prevFetched, realEstate: newState }
                                })
                            } else {
                                setRealEstate((prevFetched: DefaultRealEstateType) => {
                                    const newState = prevFetched.realEstate
                                        .map((fetched: RealEstate) => {
                                            if (fetched?.house?.property_id === property?.property_id) {
                                                //calc cashflow and append str
                                                const estCashflow = calculateCashflow(fetched?.house?.list_price, (data?.content?.median_night_rate as number * daysInMonth(data?.content?.median_occupancy_rate)))
                                                return { ...fetched, str: data, estCashflow }
                                            }
                                            return fetched
                                        })
                                    return { ...prevFetched, realEstate: newState }
                                })
                            }
                            // remove any properties that don't have str data
                            // let ltrParams = new URLSearchParams({
                            //     address: property.location.address.line !== null ? property.location.address.line.toString() : "",
                            //     bedrooms: (property.description.beds === null ? "0" : property.description.beds.toString()),
                            //     bathrooms: (property.description.baths === null ? "0" : property.description.baths.toString()),
                            //     sqft: (property.description.sqft === null ? "0" : property.description.sqft.toString()),
                            // })
                        })
                );
            }
            await Promise.all(strPromises);
            if (mapToggle) {
                mapToggle((prev: any) => !prev);
            }

        } catch (error) {
            setSearchIsLoading(false);
            setPageNumber((prev: any) => prev + 1);
            console.error(error);
        }
    }

    const handleSearchButtonPress = () => {
        if (router.pathname !== "/dashboard") {
            router.push('/dashboard');
        }
        console.log(inputValue, "handleSearchButton inputValue");
        setFilters({ ...filters, search: currentInputValue })
        handleSearch();
    }

    const handleDropDownShowing = (value: string) => {
        //if empty hide
        if (value === "") {
            setShowDropDown(false);
            return;
        }

        if (showDropDown) {
            setShowDropDown(false);
        }

        const getSuggestions = async () => {
            if (value !== "") {
                setShowDropDown(true);
                try {
                    const res = await fetch(`/api/suggestlocation?query=${value}`);
                    const data = await res.json();
                    if (data.status === 200) {
                        setNumberOfResults(data.data.length);
                        if (Array.isArray(data.data)) {
                            setResults(data.data);
                        } else {
                            setResults([]);
                        }
                    }
                    console.log(data, "searchbar")
                } catch (error) {
                    console.error(error);
                }
            }
        }

        getSuggestions();

    }

    useEffect(() => {
        const handleOutsideClick = (e: any) => {
            if (e.target.className !== styles.input) {
                setShowDropDown(false);
            }
        }

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        }
    }, [])

    useEffect(() => {
        if (router.pathname === "/dashboard" && realEstate?.realEstate.length === 0) {
            handleSearch("init");
        } else if (isScrolledToBottom) {
            handleSearch("scroll");
        }
    }, [isScrolledToBottom])

    /*
        so this is not my best idea,
        right now this is the only way I can think of to 
        make a new search when the filters update
    */
    useEffect(() => {
        if (didMount.current) {
            if (filters.filters !== prevFilters && prevFilters !== undefined) {
                handleSearch();
            }
        } else {
            didMount.current = true;
        }
    }, [filters])


    return (
        <>
            <Modal
                isOpen={demoModal}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName={"overlay"}
            >
                <div className={styles.modal__wrapper}>
                    <h4>Please register or log in to continue</h4>
                    <span>To experience the full version of Fetchit, you must Login or Sign Up!</span>
                    <div className={styles.modal__buttons}>
                        <button className={styles.signup} onClick={() => router.push('/signup')}>Sign Up</button>
                        <button className={styles.login} onClick={() => router.push('/login')}>Login</button>
                    </div>
                </div>
            </Modal>
            <div className={styles.container}>
                <div className={styles.search__container}>
                    {/* get input value */}
                    <input
                        onFocus={() => handleDropDownShowing(inputValue)}
                        className={styles.input}
                        placeholder={readOnly?.propertyTitle}
                        value={(currentInputValue === "Los Angeles, California  " ? "" : currentInputValue)} //weird trick to display "" on first page load, notice the extra spaces
                        onChange={(e) => {
                            updateInputValue(e.target.value);
                            handleDropDownShowing(e.target.value);
                        }}
                    />
                    {showDropDown ? <div className={styles.autofill__container}>
                        <div className={styles.autofill__item__header}>Results <span>{sortedAutoFill.length}</span></div>
                        {(sortedAutoFill
                            ?.map((result: { city: string, state_code: string }, i: number) => (
                                <AutoFillItem
                                    handleClick={handleSelectClick}
                                    value={{ city: result.city, stateCode: result.state_code }}
                                    text={`${result.city}, ${result.state_code}`}
                                    key={i}
                                />
                            )))}
                    </div> : <></>}
                </div>
                <button className={styles.btn} onClick={handleSearchButtonPress}>
                    <Image alt='' src='/imgs/dashsearch.svg' width='18' height='18' />
                </button>
            </div>
        </>
    )
}

export default SearchBar