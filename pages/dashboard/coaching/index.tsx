import React, { useState } from 'react';
import styles from "../../../styles/Coaching.module.css";
import NavbarAuthed from "../../../components/NavbarAuthed";
import LayoutDashboard from "../../../components/LayoutDashboard";
import SearchBar from "../../../components/SearchBar";
import FilterDropDowns from "../../../components/FilterDropDowns";
import Image from "next/image";
import { Prisma } from '@prisma/client'
import { useRouter } from 'next/router';
import DropDownWithSearch from '../../../components/DropDownWithSearch';
type Coach = any;


export async function getServerSideProps(context: any) {

    const search = context?.query?.search;
    let url = 'api/getcoaches?search=ALL&sort=review';
    if (search) {
        url = `api/getcoaches?search=${search}&sort=review`
    }
    console.log({ url })
    const res = await fetch(process.env.URL + url);
    const data = await res.json();

    return {
        props: { initCoaches: data?.coaches },
    }
}

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



const CoachCard: React.FC<{ coach: Coach }> = ({ coach }) => {
    const router = useRouter();

    let total = 0;

    for (let i = 0; i < coach.reviews.length; i++) {
        total += coach.reviews[i].rating;
    }

    const average = total / coach.reviews.length;

    const navigateToCoach = () => {
        router.push('/dashboard/coaching/' + coach.id);
    }

    return (
        <div className={styles.card__parent__container} onClick={navigateToCoach}>
            <div className={styles.card__image__container}>
                <Image className={styles.coachcard__image} alt='' src={coach.images[0].url} style={{ objectFit: "cover" }} fill />
            </div>
            <div className={styles.card__text__container}>
                <div className={styles.card__title__container}>
                    <h4 className={styles.coachcard__title}>{coach.name}</h4>
                    <div className={styles.card__details}>
                        <span className={styles.card__location}>{coach.city}{coach.stateCode !== "null" ? ',' : ''} {coach.stateCode !== "null" ? coach.stateCode : ""}</span>
                        <Image alt='' src='/imgs/coachcardpin.svg' width='17' height='17' />
                    </div>
                </div>
                <div className={styles.coachcard__bottom__container}>
                    {average ? <div className={styles.coachcard__reviews__container}>
                        <span>{average}</span>
                        <Image src='/imgs/coachstar.svg' alt='' width='15' height='15' />
                    </div> : <></>}
                    <div>
                        {coach.tags.length !== 0 && coach.tags ? <div className={styles.coachcard__tags}>
                            {coach.tags.map((tag: any, index: number) => {
                                if (index < 4) {
                                    //To Fix spelling by being lazy
                                    if (tag.tag === "NEWCONSTRUCTION") tag.tag = "NEW CONSTRUCTION";
                                    if (tag.tag === "ARBITRAGESUBLEASING") tag.tag = "ARBITRAGE/SUBLEASING";
                                    if (tag.tag === "ARBITRAGESUBLEASING") tag.tag = "ARBITRAGE/SUBLEASING";
                                    if (tag.tag === "MIDTERMRENTALS") tag.tag = "MIDTERM RENTALS";
                                    return (
                                        <div key={index} className={styles.coachcard__tag}>
                                            {tag.tag}
                                        </div>
                                    )
                                }
                            })}
                        </div> : <></>}
                    </div>
                </div>
                <p className={styles.coachcard__bio}>{coach.bio}</p>
            </div>
        </div>
    )
}

const Coaching: React.FC<{ initCoaches: Coach[] | undefined }> = ({ initCoaches }) => {
    const [searchIndex, setSearchIndex] = useState(0);
    if (!initCoaches) {
        throw new Error("Err no coaches found")
    }
    const [coaches, setCoaches] = useState<Coach[]>(initCoaches); //array of coaches
    const [coachingParams, setCoachingParams] = useState({
        search: searchOptions[searchIndex],
        sort: "newest"
    });

    const updateCoachingParams = (newValues: any) => {
        setCoachingParams((prev: any) => {
            return { ...prev, ...newValues };
        });
    }

    const handleSearch = async () => {
        const res = await fetch(`/api/getcoaches?search=${coachingParams.search.name.toLocaleUpperCase()}&sort=${coachingParams.sort}`)
        const data = await res.json();
        setCoaches(data.coaches);
    }

    const handleAllSearch = async () => {
        const res = await fetch(`/api/getcoaches?search=ALL&sort=${coachingParams.sort}`)
        const data = await res.json();
        setCoaches(data.coaches);
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
                                <DropDownWithSearch index={searchIndex} setIndex={setSearchIndex} handleSearch={handleSearch} update={updateCoachingParams} />
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
                        <div>
                            <h4 className={styles.results__title}>General Coaches</h4>
                            <span className={styles.results__small}>{coaches ? coaches.length : 0} Coaches</span>
                        </div>
                        <div className={styles.sort}>
                            <span>Sort By:</span>
                            <select value={coachingParams.sort} onChange={(e: any) => updateCoachingParams({ sort: e.target.value })}>
                                <option value='newest'>Newest Coach</option>
                                <option value='highest'>Highest Rating</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.coachingcards__container}>
                        {coaches !== undefined ? coaches.map((coach: any, index: number) => {
                            return <CoachCard coach={coach} key={index} />
                        }) : null}
                    </div>
                </div>
            </LayoutDashboard>
        </div>
    );
}

export default Coaching;