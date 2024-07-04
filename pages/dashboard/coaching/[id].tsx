import React, { useContext, useEffect, useState } from 'react'
import LayoutDashboard from '../../../components/LayoutDashboard';
import NavbarAuthed from '../../../components/NavbarAuthed';
import Image from 'next/image';
import styles from '../../../styles/SelectedCoach.module.css';
import DropDownWithSearch from '../../../components/DropDownWithSearch';
import Link from 'next/link';
import { useRouter } from 'next/router';

const searchOptions = [
    {
        name: "Glamping",
        unselectedImage: '/imgs/glamping_unselected.svg',
        selectedImage: '/imgs/glamping.svg'
    },
    {
        name: "Treehouse",
        unselectedImage: '/imgs/treehouse.svg',
        selectedImage: '/imgs/treehouse_selected.svg'
    },
    {
        name: "New Construction",
        unselectedImage: '/imgs/newconstruction.svg',
        selectedImage: '/imgs/newconstruction_luxury.svg'
    },
    {
        name: "Luxury",
        unselectedImage: '/imgs/luxury.svg',
        selectedImage: '/imgs/lux_selected.svg'
    }
]

export async function getServerSideProps(context: any) {
    const { id } = context.params;
    const res = await fetch(process.env.URL + 'api/getcoach?id=' + id);
    const data = await res.json();

    return {
        props: {
            coach: data,
        },
    }
}

const SelectedCoach: React.FC<{ coach: any }> = ({ coach }) => {
    const router = useRouter();
    const [searchIndex, setSearchIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState(0.5);
    const [coachingParams, setCoachingParams] = useState({
        search: searchOptions[searchIndex],
        sort: "newest"
    });

    const updateCoachingParams = (newValues: any) => {
        setCoachingParams((prev: any) => {
            return { ...prev, ...newValues };
        });
    }


    const randomNumbersInit: number[] = [];
    while (randomNumbersInit.length < 2) {
        const r = Math.floor(Math.random() * 4) + 1;
        if (randomNumbersInit.indexOf(r) === -1) randomNumbersInit.push(r);
    }

    const [randomNumbers, setRandomNumbers] = useState([randomNumbersInit[0], randomNumbersInit[1]]);


    console.log({ coach });

    let total = 0;

    for (let i = 0; i < coach.reviews.length; i++) {
        total += coach.reviews[i].rating;
    }

    const average = total / coach.reviews.length;

    const handleSearchWithRouter = () => {
        router.push(`/dashboard/coaching?search=${coachingParams.search.name.toLocaleUpperCase()}&sort=${coachingParams.sort}`)
    }

    const handleAllSearch = async () => {
        router.push(`/dashboard/coaching?search=ALL&sort=${coachingParams.sort}`)
    }

    const handleBookTime = () => {
        if (selectedTime === 0.5 && coach?.stripeLinkThirty) {
            router.push(coach?.stripeLinkThirty);
        } else if (selectedTime === 1 && coach?.stripeLinkHour) {
            router.push(coach?.stripeLinkHour);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <NavbarAuthed />
            </div>
            <LayoutDashboard isCentered={true}>
                <div>
                    <span className={styles.small}>Find a Coach</span>
                    <h1 className={styles.title}>Get Help With Our <span>Expert</span> Coaches</h1>
                    <p className={styles.subtitle}>Discover Your Full Potential with Fetchit University&apos;s Expert Coaching Services</p>
                </div>
            </LayoutDashboard>
            <div className={styles.searchcontrol__container}>
                <LayoutDashboard isCentered={true}>
                    <div className={styles.bar__container}>
                        <div className={styles.bar__item__title}>
                            <h2 className={styles.altitle}>Select a Category For Coaches</h2>
                            <p className={styles.alsub}>Find Your Ideal Coach - Select a Category that Fits Your Needs</p>
                        </div>
                        <div className={styles.bar__item__search}>
                            <div className={styles.bar__item__search__container}>
                                <DropDownWithSearch index={searchIndex} setIndex={setSearchIndex} handleSearch={handleSearchWithRouter} update={updateCoachingParams} />
                                <span className={styles.search__inside__font}>Or <span onClick={handleAllSearch}>View General Coaches</span></span>
                            </div>
                        </div>
                        <div className={styles.bar__item__highlights}>
                            <Image src='/imgs/purple_check.svg' alt='' width='22' height='22' />
                            <span>Expert Advice</span>
                            <Image src='/imgs/purple_check.svg' alt='' width='22' height='22' />
                            <span>Seamless Process</span>
                        </div>
                    </div>
                </LayoutDashboard>
                <Image className={styles.ppl__img} src='/imgs/people_coaching.svg' width='311' height='84' alt='' />
            </div>
            <LayoutDashboard isCentered={true}>
                <div className={styles.bottom__container}>
                    <hr className={styles.hr} />
                    <div className={styles.results__top__container}>
                        <div className={styles.results__inner__container}>
                            <h4 className={styles.results__title}>Connect With {coach.name}</h4>
                            <p className={styles.results__small}>{coach.bio}</p>
                        </div>
                        {coach.reviews.length !== 0 ? coach.reviews.map((review: any, index: number) => {
                            if (index < 2) {
                                return (
                                    <div key={index} className={styles.review__container}>
                                        <span>&quot;{review.message}&quot;</span>
                                        <div className={styles.review__inner}>
                                            <div className={styles.review__image__container}>
                                                <Image src={`/imgs/randomcoaches/${randomNumbers[index]}.svg`} alt='' fill />
                                            </div>
                                            <span>{review.name}</span>
                                        </div>
                                    </div>
                                )
                            }
                        }) : null}
                        <div className={styles.sort}>
                            <div className={styles.sort__inner}>
                                {average ? <div className={styles.coachcard__reviews__container}>
                                    <span>{average}</span>
                                    <Image src='/imgs/coachstar.svg' alt='' width='15' height='15' />
                                    <span className={styles.review__count__font}>({coach.reviews.length})</span>
                                </div> : <></>}
                                <div className={styles.card__details}>
                                    <span className={styles.card__location}>{coach.city}{coach.stateCode !== "null" ? ',' : ''} {coach.stateCode !== "null" ? coach.stateCode : ""}</span>
                                    <Image alt='' src='/imgs/coachcardpin.svg' width='17' height='17' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.coachingcards__container}>
                        <div className={styles.content}>
                            <div className={styles.content__details__container}>
                                <div className={styles.image__slider__container}>
                                    <div className={styles.image__container}>
                                        <Image src={coach.images[0].url} alt='' fill style={{ objectFit: "cover" }} />
                                    </div>
                                    <div className={styles.image__controls}>
                                        <div className={styles.image__arr__button}>
                                            <Image alt='' src='/imgs/coachingleftarr.svg' width='13' height='8' />
                                        </div>
                                        <div className={styles.image__arr__button}>
                                            <Image alt='' src='/imgs/coachingrightarr.svg' width='13' height='8' />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.content__text__container}>
                                    <div className={styles.content__text__title__container}>
                                        <h4>About {coach.name}</h4>
                                        <Link target="_blank" className={styles.airbnblink} href={coach?.airbnbProfileLink}>
                                            <span>Airbnb</span>
                                            <Image alt='' src='/imgs/paperclip.svg' width='20' height='20' />
                                        </Link>
                                    </div>
                                    <p className={styles.content__desc}>
                                        {coach.description}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.contact__container}>
                                <div className={styles.conact__inner__container}>
                                    <h4>Schedule a session</h4>
                                    <span className={styles.choose__font}>Choose Time</span>
                                    <div className={styles.timepicker__container}>
                                        <div className={`${styles.picker} ${selectedTime === 0.5 ? styles.pickerselected : ""}`} onClick={() => setSelectedTime(0.5)}>30 mins</div>
                                        <div className={`${styles.picker} ${selectedTime === 1 ? styles.pickerselected : ""}`} onClick={() => setSelectedTime(1)}>1 hour</div>
                                    </div>
                                    <div className={styles.pricing__info__container}>
                                        <div className={styles.pricing__wrapper__font}>
                                            <span className={styles.pricing__font__details}>Estimated Rate &nbsp; <span className={styles.pricing__detail__bold}>${selectedTime === 0.5 ? coach.thirtySession : coach.hourSession}</span><span className={styles.pricing__detail__small}>/{selectedTime === 0.5 ? "30 min" : "1 hour"}</span></span>
                                        </div>
                                        <div className={styles.coach__req__container}>
                                            <span className={styles.or__font}>Or&nbsp;&nbsp;</span>
                                            <button className={styles.coachbtnreq}>
                                                Request
                                                <Image src='/imgs/coachinfo.svg' alt='' width='15' height='15' />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={handleBookTime} className={styles.pricing__submit}>Book Time</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutDashboard>
        </div>
    )
}

export default SelectedCoach;