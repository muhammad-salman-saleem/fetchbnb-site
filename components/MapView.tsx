import React, { useState, useCallback, FC, useEffect, useContext } from 'react'
import Map, { Marker } from 'react-map-gl';
import styles from '../styles/MapView.module.css';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '../shared/interfaces/Property';
import { useRouter } from 'next/router';
import { RealEstateContext, DefaultRealEstateType } from '../contexts/RealEstate';

const MarkerItem: FC<any> = ({ onMClick, id, loc, property }) => {
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const _onClick = (e: any) => {
        onMClick(loc, id);
        setIsPopupOpen(true);
    }

    //if outside click, close popup
    useEffect(() => {
        const closePopup = (e: any) => {
            if (e.target.id !== id) {
                setIsPopupOpen(false);
            }
        }
        window.addEventListener('click', closePopup);
        return () => {
            window.removeEventListener('click', closePopup);
        }
    }, [id])


    let decidedDotColor = '/imgs/redpin.svg';
    if(property?.estCashflow !== undefined) {
        if(property?.estCashflow > 14_000) {
            decidedDotColor = '/imgs/greenpin.svg';
        } else if(property?.estCashflow > 0) {
            decidedDotColor = '/imgs/yellowpin.svg';
        } else {
            decidedDotColor = '/imgs/redpin.svg';
        }
    }
    return (
        <div id={id} className={styles.marker__container}>
            <Image
                id={id}
                onClick={_onClick}
                alt=''
                src={decidedDotColor}
                width='28'
                height='28'
                style={{ cursor: 'pointer' }}
            />
            {isPopupOpen ? <div className={styles.popup}>
                <Image
                    className={styles.popup_image}
                    alt=''
                    src={property.house.primary_photo.href}
                    width='84'
                    height='68'
                />
                <div className={styles.popdata}>
                    <div>
                        <p className={styles.address__line}>{property?.house?.location?.address?.line?.toString()}</p>
                        <p className={styles.subaddress}>{property.house?.location?.address?.city}, {property.house?.location?.address?.state_code} {property.house?.location?.address?.postal_code}</p>
                        <p className={styles.underprices}>{property?.house?.list_price}&nbsp;&nbsp;&nbsp;{property.house?.description?.beds} bd, {property.house?.description?.baths} ba</p>
                    </div>
                    <button id={id} onClick={() => {router.push('/dashboard/' + property.house?.listing_id)}} className={styles.popup__button}>View</button>
                </div>
            </div> : <></>}
        </div>
    )
}

const findFirstCoord = (realEstate: any) => {
    //find first Property where coordinate is not null
    const firstCoord = realEstate.find((house: any) => {
        return house?.house?.location?.address?.coordinate?.lat !== null && house?.house?.location?.address?.coordinate?.lat !== undefined && house?.house?.location?.address?.coordinate?.lon !== null && house?.house?.location?.address?.coordinate?.lon !== undefined
    }
    )
    if (firstCoord !== undefined) {
        return firstCoord.house.location.address.coordinate
    }
    return { lat: 0, lon: 0 }
}

const MapView: React.FC<{ propertiesUpdated: boolean }> = ({ propertiesUpdated }) => {
    const router = useRouter();
    const [realEstate, setRealEstate] = useContext(RealEstateContext);
    const [clickTiggered, setClickTriggered] = useState(false);
    const [showMapBtn, setShowMapBtn] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [viewState, setViewState] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 10
    });

    useEffect(() => {
        setViewState({
            // longitude: (realEstate[0]?.location?.address?.coordinate?.lon !== undefined ? realEstate[0]?.location?.address?.coordinate?.lon : 0),
            // latitude: (realEstate[0]?.location?.address?.coordinate?.lat !== undefined ? realEstate[0]?.location?.address?.coordinate?.lat : 0),
            longitude: findFirstCoord(realEstate.realEstate).lon,
            latitude: findFirstCoord(realEstate.realEstate).lat,
            zoom: 10
        })
    }, [propertiesUpdated])


    const handleOnMove = async (viewState: any) => {
        setViewState(viewState);
        // setShowMapBtn(true);
    }
    const onClick = async () => {
        console.log("moved")
    }

    const handleClick = useCallback(() => {
        if (!clickTiggered) {
            onClick();
        }
    }, [clickTiggered]);

    const handleMouseUp = (event: any) => {
        if (event.button !== 2) {
            setClickTriggered(true);
            setTimeout(() => setClickTriggered(false), 10);
            onClick();
        }
    };

    const onMarkerClick = (loc: { lon: number, lat: number }, id: string) => {
        const house = realEstate.realEstate.find((house: any) => house.house.property_id === id)
        // setSelectedHouse(house);
        setViewState({
            longitude: loc.lon,
            latitude: loc.lat,
            zoom: 13
        })
        if (house !== undefined) {
            router
                .push(`/dashboard#${house.house.property_id}`, undefined, { shallow: true })
                .catch((e) => {
                    // workaround for https://github.com/vercel/next.js/issues/37362
                    if (!e.cancelled) {
                        throw e
                    }
                })
        }
    }


    if (realEstate === undefined || Object.keys(realEstate.realEstate).length === 0) {
        return (
            <div className={styles.height}>
                <Map
                    {...viewState}
                    onMove={evt => handleOnMove(evt.viewState)}
                    onClick={handleClick}
                    onMouseUp={handleMouseUp}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken='pk.eyJ1IjoiYnlyZGtvaGwiLCJhIjoiY2xiazlpazBqMDdsdDNvbXU3eDkxdTV5cCJ9.VKQTm7Im4n_lXfCpOQIQCQ'
                />
            </div>
        )
    }

    return (
        <div className={styles.height}>
            <Map
                {...viewState}
                onMove={evt => handleOnMove(evt.viewState)}
                onClick={handleClick}
                onMouseUp={handleMouseUp}
                style={{ width: "100%", height: "100%"}}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken='pk.eyJ1IjoiYnlyZGtvaGwiLCJhIjoiY2xiazlpazBqMDdsdDNvbXU3eDkxdTV5cCJ9.VKQTm7Im4n_lXfCpOQIQCQ'
            >
                <>
                    {/* <MapButton showMapBtn={showMapBtn} handleSearchFromMap={handleSearchFromMap} isLoading={isSearchLoading}/> */}
                    {realEstate.realEstate.map((house: any, index: number) => {
                        if (house?.house?.location?.address?.coordinate?.lat !== undefined && house?.house?.location?.address?.coordinate?.lon !== undefined && house?.house?.location?.address?.coordinate?.lat !== null && house?.house?.location?.address?.coordinate?.lon !== null) {
                            return (
                                <Marker
                                    key={index}
                                    longitude={house.house.location.address.coordinate.lon}
                                    latitude={house.house.location.address.coordinate.lat}
                                    anchor="center"
                                >
                                    <MarkerItem property={house} onMClick={onMarkerClick} id={house.house.property_id} loc={{ lon: house.house.location.address.coordinate.lon, lat: house.house.location.address.coordinate.lat }} />
                                </Marker>
                            )
                        }
                    })
                    }
                </>
            </Map>

        </div >
    )
}

export default MapView