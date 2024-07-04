import React, { useContext, useEffect, useState } from 'react'
import LayoutDashboard from '../../components/LayoutDashboard';
import NavbarAuthed from '../../components/NavbarAuthed';
import styles from '../../styles/Dashboard.module.css';
import SearchBar from '../../components/SearchBar';
import FilterDropDowns from '../../components/FilterDropDowns';
import Image from 'next/image';
import DashboardContent from '../../components/DashboardContent';
import MapView from '../../components/MapView';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import SelectedContent from '../../components/SelectedContent';
import { useRouter } from 'next/router';
import { RealEstateContext, DefaultRealEstateType } from '../../contexts/RealEstate';
import PouchDB from 'pouchdb'
import { RealEstate } from '../../shared/interfaces/RealEstate';
import { FilterContext } from '../../contexts/FiltersContext';
import { ReadOnlyContext } from '../../contexts/ReadOnlyContext';

var db = new PouchDB('properties');

export async function getServerSideProps(context: any) {
    const isDemo = context?.query?.isDemo;
    if (isDemo) {
        return {
            props: {

            },
        }
    }
    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user: any = session?.user
    console.log("user from dashboard: ", user)
    console.log(user, 'user from index page')
    if (user === undefined) {
        return {
            redirect: {
                destination: '/pricing',
                permanent: false,
            }
        }
    }
    if (user?.plan === "UNPAID" || user?.plan === undefined) {
        return {
            redirect: {
                destination: '/pricing?error=unpaid',
                permanent: false,
            }
        }
    }
    if (user?.plan === "ZONING") {
        return {
            redirect: {
                destination: '/dashboard/zoning',
                permanent: false,
            }
        }
    }
    console.log("user from dashboard 2: ", user)
    delete user.emailVerified;
    return {
        props: {
            user: user,
        },
    }
}

type DashboardProps = {
    user: any;
}

enum Plan {
    UNPAID = "UNPAID",
    ZONING = "ZONING",
    RENTAL = "RENTAL",
    BUYING = "BUYING",
    BOTH = "BOTH",
}

const SelectedPropertyPage = () => {
    const router = useRouter();
    const { listingId } = router.query
    const [filters, setFilters] = useContext(FilterContext);
    const [realEstate, setRealEstate] = useContext(RealEstateContext);
    const [selectedProperty, setSelectedProperty] = React.useState<any>(null);
    const [propertiesUpdated, setPropertiesUpdated] = useState<boolean>(false);

    useEffect(() => {
        const selectedPropertyFound: RealEstate = realEstate.realEstate.find((property: RealEstate) => property?.house?.listing_id === listingId);
        if (selectedPropertyFound === undefined || selectedPropertyFound === null && listingId !== undefined) {
            db.get(listingId as string).then((doc) => {
                setSelectedProperty(doc)
            }).catch((err) => {
                if (err) {
                    router.push('/dashboard?error=propertyNotFound');
                }
            })
        } else if (realEstate.realEstate.length > 0 && selectedPropertyFound !== undefined) {
            setSelectedProperty(selectedPropertyFound);
        }
    }, [listingId, realEstate])
    const updateFilters = (newValues: any) => {
        setFilters({ filters: { ...filters.filters, ...newValues } });
        console.log(newValues, "new")
    }
    const updateInputValue = (newValue: string) => {
        setFilters({ ...filters, search: newValue })
    }

    const [readOnly, setReadOnly] = useContext(ReadOnlyContext);
    const handleCustomGeoLoad = (newTitle: string) => {
        setReadOnly({ ...readOnly, propertyTitle: newTitle });
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <NavbarAuthed />
                <div className={styles.searchcontrol__container}>
                    <LayoutDashboard>
                        <div className={styles.searchcontrol__flex}>
                            <div className={styles.searchcontrol__start}>
                                <SearchBar handleCustomGeoLoad={handleCustomGeoLoad} mapToggle={setPropertiesUpdated} isScrolledToBottom={true} searchIsLoading={false} setSearchIsLoading={(x: boolean) => x} />
                                <span className={styles.searchcontrol__small}>Filters</span>
                                <div className={styles.vertical__line}></div>
                            </div>
                            <FilterDropDowns filters={filters.filters} handleChange={updateFilters} />
                            <div className={styles.rankings}>
                                <div>
                                    <Image src='/imgs/rank1.svg' width='11' height='11' alt='' />
                                    <span className={styles.rank__font}>Poor Property</span>
                                </div>
                                <div>
                                    <Image src='/imgs/rank2.svg' width='11' height='11' alt='' />
                                    <span className={styles.rank__font}>Medium Property</span>
                                </div>
                                <div>
                                    <Image src='/imgs/rank3.svg' width='11' height='11' alt='' />
                                    <span className={styles.rank__font}>Great Property</span>
                                </div>
                            </div>
                        </div>
                    </LayoutDashboard>
                </div>
            </div>
            <div className={styles.dashboard__split}>
                <div className={styles.split}>
                    <div className={styles.dashboard__content}>
                        <SelectedContent selectedProperty={selectedProperty} />
                    </div>
                    <div className={styles.mapview}>
                        <MapView propertiesUpdated={propertiesUpdated} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectedPropertyPage;