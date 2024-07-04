import React, { useState, useEffect, useRef } from 'react'
import styles from '../styles/Homepage.module.css';
import MainLayout from '../components/MainLayout';
import MainNavbar from '../components/MainNavbar';
import Image from 'next/image';
import MainDemoSearchBar from '../components/MainDemoSearchBar';
import useWindowDimensions from '../components/hooks/useWindowDimensions';
import MainPreviewHouseCard from '../components/MainPreviewHouseCard';
import MainOverflowLayout from '../components/MainOverflowLayout';
import MainSlideShowDots from '../components/MainSlideShowDots';
import MainFeatureImages from '../components/MainFeatureImages';
import MainHeroCtaButton from '../components/MainHeroCtaButton';
import MainLargerOverflowLayout from '../components/MainLargerOverflowLayout';
import MainFooter from '../components/MainFooter';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import Modal from "react-modal";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user = session?.user


    if (user?.plan !== "UNPAID" && user?.plan !== undefined) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }
    return {
        props: {},
    }
}

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
        maxWidth: "500px",
        padding: "15px",
        overflow: 'auto',
        background: "none",
        border: "none",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}

const Start = () => {
    const router = useRouter();
    const isMobileState = useWindowDimensions();
    const scollToRef: any = useRef();
    const scollToRefReferall: any = useRef();
    const scollToRefReviews: any = useRef();
    const scollToRefProperties: any = useRef();
    const [slideShowPos, setSlideShowPos] = useState({
        preview: 1,
        refferal: 1,
        reviews: 1,
        properties: 1
    });
    const [slideShowPosRefferal, setSlideShowPosRefferal] = useState(1);
    const [slideShowPosReviews, setSlideShowPosReviews] = useState(1);
    const [selectedFeature, setSelectedFeature] = useState("1");
    const [email, setEmail] = useState("");
    const [emailResponse, setEmailResponse] = useState({ msg: "", color: "" });
    const [showMobileFeatureImage, setShowMobileFeatureImage] = useState(false);

    const submitEmailList = async () => {
        if (email === "") {
            setEmailResponse({ msg: "Please enter an email address", color: "red" });
            return;
        }
        const res = await fetch(`/api/addusertoemail?email=${email}`);
        const data = await res.json();
        if (data?.status === "done") {
            setEmailResponse({ msg: "Signed up successfully, redirecting...", color: "#1BBD3F" });
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    }

    const scroll = (scrollOffset: number, ref: any, selector: string, max: number) => {
        ref.current.scrollLeft += scrollOffset;
        if (scrollOffset > 0) {
            setSlideShowPos((prev: any) => prev[selector] < max ? { ...prev, [selector]: prev[selector] + 1 } : {
                ...prev,
                [selector]: max
            });
        } else {
            setSlideShowPos((prev: any) => prev[selector] > 1 ? { ...prev, [selector]: prev[selector] - 1 } : {
                ...prev,
                [selector]: 1
            });
        }
    };
    useEffect(() => {
        //code mostly comes from stackoverflow
        var getElementsInArea = (function (docElm) {
            var viewportHeight = docElm.clientHeight

            return function (e: any, opts: any) {
                var found = [], i;

                if (e && e.type == 'resize') viewportHeight = docElm.clientHeight

                for (i = opts.elements.length; i--;) {
                    var elm = opts.elements[i],
                        pos = elm.getBoundingClientRect(),
                        topPerc = (pos.top / viewportHeight) * 100,
                        bottomPerc = (pos.bottom / viewportHeight) * 100,
                        middle = (topPerc + bottomPerc) / 2,
                        inViewport = middle > opts.zone[1] && middle < 100 - opts.zone[1]
                    let inTopViewport: any = (topPerc < opts.zone[0] - 30);
                    let bottomViewport: any = (bottomPerc > 100 - opts.zone[0] + 30);
                    elm.classList.toggle(opts.markedClass, inViewport)

                    //if the element is in the middle of the viewport, then add class and play sound, then update state
                    if (inViewport) {
                        console.log("show image if not already")
                        found.push(elm)
                        let currentMarker = elm.getAttribute('custom-attribute-marker');
                        if (currentMarker === '1') {
                            setShowMobileFeatureImage(true);
                        }
                        if (currentMarker === '4') {
                            setShowMobileFeatureImage(true);
                        }
                        setSelectedFeature((prev) => {
                            if (prev !== currentMarker) {
                                var audio = new Audio("/audio/sound.mp3");
                                audio.play();
                                return currentMarker;
                            } else {
                                return prev;
                            }
                        })
                    }
                    //if the last feature element is in the top viewport, then hide the feature image
                    if (inTopViewport && elm.getAttribute('custom-attribute-marker') === '4') {
                        setShowMobileFeatureImage(false);
                    }
                    if (bottomViewport && elm.getAttribute('custom-attribute-marker') === '1') {
                        setShowMobileFeatureImage(false);
                    }
                }
            }
        })(document.documentElement)


        function f(e: any) {
            getElementsInArea(e, {
                elements: document.querySelectorAll('.awaiting-middle'),
                markedClass: 'active-middle',
                zone: [40, 40] // percentage distance from top & bottom
            })
        }


        window.addEventListener('scroll', f)
        window.addEventListener('resize', f)

        // cleanup
        return () => {
            window.removeEventListener('scroll', f)
            window.removeEventListener('resize', f)
        }
    }, []);

    console.log(showMobileFeatureImage)

    //--modal functions
    const [isOpen0, setIsOpen0] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);

    function openModal0() {
        setIsOpen0(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen0(false);
        setIsOpen1(false);
    }

    //--end modal functions
    const openVideoModal = (videoNum: number) => {
        if (videoNum === 0) {
            openModal0();
        } else if (videoNum === 1) {
            setIsOpen1(true);
        }
    }
    console.log("We see you :)")
    return (
        <>
            <Modal
                isOpen={isOpen0}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName={"overlay"}
            >
                <div>
                    <video width="400px" height="500px" controls>
                        <source src="/videos/land.mp4" type="video/mp4" />
                    </video>
                </div>
            </Modal>
            <div className={styles.background}>
                <div className={styles.background__img}>
                    <div className={styles.check__mark__landing}>
                        <div className={styles.check__mark__container}>
                            <Image src='/imgs/check_circle.svg' width='29' height='29' alt='' />
                            <span>Gain Useful Knowledge</span>
                        </div>
                        <div className={styles.check__mark__container}>
                            <Image src='/imgs/check_circle.svg' width='29' height='29' alt='' />
                            <span>Simple as Just Signing Up</span>
                        </div>
                        <div className={styles.check__mark__container}>
                            <Image src='/imgs/check_circle.svg' width='29' height='29' alt='' />
                            <span>Become an Airbnb Pro</span>
                        </div>
                    </div>
                    <div className={styles.alertbar} onClick={() => router.push('/signup')}>Sign up today for Fetchit! | 20% OFF</div>
                    <MainLayout>
                        <MainNavbar landingPage />
                    </MainLayout>
                    <MainLayout>
                        <section className={styles.hero__layout}>
                            <div className={styles.larger__container}>
                                <div className={styles.hero__font__container}>
                                    <h1 className={styles.title}>Get ahead of the competition with our <span className={styles.title__highlight}>Market Analysis</span> Report.</h1>
                                    <p className={styles.small_hero_font}>Our report provides key insights into occupancy rates, average daily rates, and competitor analysis for specific locations where our software is used. Use this information to maximize your rental income and increase profits.</p>
                                </div>
                                <div className={styles.email__form}>
                                    <span>Enter Email</span>
                                    <div className={styles.email__form__box}>
                                        <input placeholder='Email' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <button onClick={submitEmailList}>Get Newsletter</button>
                                    </div>
                                    <span style={{ color: emailResponse?.color }}>{emailResponse?.msg}</span>
                                </div>
                            </div>
                            <div>{isMobileState.generalSize !== 'desktop' ?
                                <Image src='/imgs/landingcard.svg' width='300' height='424' alt='' /> :
                                <Image src='/imgs/landingcard.svg' width='300' height='424' alt='' />}</div>
                        </section>
                    </MainLayout>
                </div>
            </div>
            <MainLayout>
                <div className={styles.landing__video__container} onClick={openModal0}>
                    <div className={styles.landing__video__top}>
                        <span>
                            Hear from our CEO on top 5 things you need in Airbnb for 2023
                            <Image src="/imgs/playsmall1.svg" alt="" width='17' height='17' />
                        </span>
                    </div>
                    <div className={styles.landing__video__bottom}>
                        <Image src="/imgs/videoplay.svg" alt="" width='93' height='93' />
                    </div>
                </div>
                <div className={styles.button__landing__container}>
                    <button className={styles.signup__button__landing} onClick={() => router.push('/signup')}>Sign Up</button>
                </div>
            </MainLayout>
            <MainFooter />
        </>
    )
}

export default Start;