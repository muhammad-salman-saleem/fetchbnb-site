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
        maxWidth: "1500px",
        padding: "15px",
        overflow: 'auto',
        background: "none",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.15)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
}

const Homepage = () => {
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
    const [showMobileFeatureImage, setShowMobileFeatureImage] = useState(false);


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
                isOpen={isOpen1}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName={"overlay"}
            >
                <div>
                    <video width="720px" height="404px" controls>
                        <source src="/videos/emma.mp4" type="video/mp4" />
                    </video>
                </div>
            </Modal>
            <div className={styles.background}>
                <div className={styles.background__img}>
                    <MainLayout>
                        <MainNavbar />
                    </MainLayout>
                    <MainLayout>
                        <section className={styles.hero__layout}>
                            <div>
                                <div className={styles.hero__font__container}>
                                    <h1 className={styles.title}>Find Short Term Rental Properties at Lightning Speed!</h1>
                                    <p className={styles.small_hero_font}>We get it, time is valuable, especially when
                                        searching for the perfect Airbnb investment. We&apos;ll handle the research so you
                                        can focus on what matters. Say goodbye to tab overload and hello to more time in
                                        your day.</p>
                                </div>
                                <MainHeroCtaButton videoOpenByDefault={!!(router?.query?.video)} />
                            </div>
                            <div>{isMobileState.generalSize !== 'desktop' ?
                                <Image src='/imgs/homepage_card1.svg' width='259' height='260' alt='' /> :
                                <Image src='/imgs/homepage_card1.svg' width='386' height='369' alt='' />}</div>
                        </section>
                        <MainDemoSearchBar />
                    </MainLayout>
                </div>
            </div>
            <MainOverflowLayout>
                <section className={styles.preview__layout}>
                    <div className={styles.preview__font__container}>
                        <div>
                            <h2 className={styles.preview__title}>View What&apos;s Important, Let us Handle The
                                Rest</h2>
                            <p className={styles.preview__subtitle}>See how a property will perform and let AI tell you
                                what properties are worth it.</p>
                            <button className={styles.hero__cta__button} onClick={() => router.push('/signup')}>Get Started</button>
                        </div>
                    </div>
                    <div className={styles.preview__slideshow} ref={scollToRef}>
                        <MainPreviewHouseCard entries={{
                            image: '/imgs/house_1.svg',
                            address: '11435 Canton Dr',
                            subaddress: 'Studio City, CA 91604',
                            beds: 4,
                            baths: 3,
                            sqft: '1,980',
                            booked: 22,
                            dailyRate: 320,
                            price: '620,000'
                        }}
                        />
                        <MainPreviewHouseCard entries={{
                            image: '/imgs/house_2.svg',
                            address: '720 N Sierra Bonita Ave',
                            subaddress: 'Los Angeles, CA 90046',
                            beds: 5,
                            baths: 3,
                            sqft: '2,700',
                            booked: 19,
                            dailyRate: 280,
                            price: '550,000'
                        }}
                        />
                        <MainPreviewHouseCard entries={{
                            image: '/imgs/house_3.svg',
                            address: '1817 S Highland Ave',
                            subaddress: 'Los Angeles, CA 90046',
                            beds: 3,
                            baths: 2,
                            sqft: '2,100',
                            booked: 23,
                            dailyRate: 237,
                            price: '450,000'
                        }}
                        />
                        <MainPreviewHouseCard isFinal />
                    </div>
                </section>
                <div className={styles.slideshow__controls}>
                    <button onClick={() => scroll(-300, scollToRef, 'preview', 4)} className={styles.slideshow__arrow}>
                        <Image src='/imgs/arrow-left.svg' alt='' width='14' height='11' /></button>
                    <MainSlideShowDots numberOfDots={4} slideShowPos={slideShowPos.preview} />
                    <button onClick={() => scroll(300, scollToRef, 'preview', 4)} className={styles.slideshow__arrow}>
                        <Image src='/imgs/arrow-right.svg' alt='' width='14' height='11' /></button>
                </div>
            </MainOverflowLayout>
            <MainLayout>
                <section className={styles.features} id='features'>
                    <div className={styles.features__font__container}>
                        <p className={styles.features__subtitle}>More about us</p>
                        <h2 className={styles.features__title}>Our Features</h2>
                    </div>
                    <div className={styles.features__container}>
                        <div className={styles.features__image}>
                            <MainFeatureImages
                                isMainFeaturesMobile={isMobileState.microAdjustments.isMainFeaturesMobile}
                                showMobileFeatureImage={showMobileFeatureImage} selectedFeature={selectedFeature}
                            />
                        </div>
                        <div className={styles.features__text__container}>
                            <div key={"1"} custom-attribute-marker="1" className={`${styles.f__fonts} awaiting-middle`}>
                                <h4 className={styles.f__title}>Short-Term Rental Predictions</h4>
                                <p className={styles.f__subtitle}>Say goodbye to confusion and hello to profits with our
                                    LIVE short term rental predictions for for-sale listings.</p>
                            </div>
                            <div key={"2"} custom-attribute-marker="2" className={`${styles.f__fonts} awaiting-middle`}>
                                <h4 className={styles.f__title}>Short Term Rental Laws and/or “Ordinances”</h4>
                                <p className={styles.f__subtitle}>Our software takes the headache out of researching
                                    short term rental laws by gathering the most updated ordinances nationwide, so you
                                    can focus on running your business.</p>
                            </div>
                            <div key={"3"} custom-attribute-marker="3" className={`${styles.f__fonts} awaiting-middle`}>
                                <h4 className={styles.f__title}>Cut Through the Noise and Get Expert Coaching
                                    Advice</h4>
                                <p className={styles.f__subtitle}>Our Verified Airbnb Host Short-Term Rental Coaches Are
                                    Here to Help!</p>
                            </div>
                            <div key={"4"} custom-attribute-marker="4" className={`${styles.f__fonts} awaiting-middle`}>
                                <h4 className={styles.f__title}>Property Insights</h4>
                                <p className={styles.f__subtitle}>Why search multiple websites for property details when
                                    our dashboard has it all? We provide information on prime locations and nearby
                                    amenities for the hottest properties available.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.barcta}>
                    <div className={styles.barcta__font__container}>
                        <span className={styles.main__smallfont}>Make the Best Decision</span>
                        <h3 className={styles.main__title}>Take the Guesswork out of Your Airbnb Investment</h3>
                        <MainHeroCtaButton />
                    </div>
                    <div className={styles.barcta__image}>
                        {isMobileState.width > 494 ?
                            <Image src='/imgs/homepage_cta_1.svg' width='485' height='312' alt='' quality='100' /> :
                            <Image src='/imgs/homepage_cta_1.svg' width='365' height='271' alt='' quality='100' />}
                    </div>
                </section>
            </MainLayout>
            <div className={styles.refferal} id='referrals'>
                <MainLayout>
                    <div className={styles.referal__font__container}>
                        <span className={styles.main__smallfont}>More for you</span>
                        <h3 className={styles.main__title}>Referral System</h3>
                        <p className={styles.refferal__sub}>Why keep a good thing to yourself when you can earn money by
                            referring friends to our platform? Share the love and get rewarded for every referral that
                            joins us.</p>
                    </div>
                </MainLayout>
                <MainOverflowLayout>
                    <section className={styles.ref__card__container} ref={scollToRefReferall}>
                        <div className={styles.ref__card}>
                            <Image className={styles.ref__image} alt='' src='/imgs/ref_1.svg' width='280' height='78' />
                            <div className={styles.ref__card__font__container}>
                                <h4 className={styles.ref__card__title}>Send invitation</h4>
                                <p className={styles.ref__card__subtitle}>Send your referral link to friends and tell
                                    them how cool Fetchit is!</p>
                            </div>
                        </div>
                        <div className={styles.ref__card}>
                            <Image className={styles.ref__image} alt='' src='/imgs/ref2.svg' width='280' height='78' />
                            <div className={styles.ref__card__font__container}>
                                <h4 className={styles.ref__card__title}>Registration</h4>
                                <p className={styles.ref__card__subtitle}>Let them register to our services using your
                                    referral link</p>
                            </div>
                        </div>
                        <div className={styles.ref__card}>
                            <Image className={styles.ref__image} alt='' src='/imgs/ref3.svg' width='280' height='78' />
                            <div className={styles.ref__card__font__container}>
                                <h4 className={styles.ref__card__title}>Enjoy the benefits</h4>
                                <p className={styles.ref__card__subtitle}>Join the community and earn from it!</p>
                            </div>
                        </div>
                    </section>
                    {isMobileState.width <= 1197 ? <div className={styles.ref__slideshow__controls}>
                        <button onClick={() => scroll(-300, scollToRefReferall, 'refferal', 3)}
                            className={styles.slideshow__arrow}><Image src='/imgs/arrow-left.svg' alt='' width='14'
                                height='11' /></button>
                        <MainSlideShowDots numberOfDots={3} slideShowPos={slideShowPos.refferal} />
                        <button onClick={() => scroll(300, scollToRefReferall, 'refferal', 3)}
                            className={styles.slideshow__arrow}><Image src='/imgs/arrow-right.svg' alt='' width='14'
                                height='11' /></button>
                    </div> : <></>}
                </MainOverflowLayout>
            </div>
            <div className={styles.refferal}>
                <MainLayout>
                    <div className={styles.reviews__header__container}>
                        <div className={styles.reviews__font__container} id='testimonials'>
                            <span className={styles.main__smallfont}>Testimonials</span>
                            <h3 className={styles.main__title}>What our customers say</h3>
                            <div className={styles.review__total}>
                                <Image alt='' src='/imgs/avatars.svg' width='130' height='36' />
                                <span className={styles.review__font__total}>2456 people love</span>
                            </div>
                        </div>
                        <div className={styles.review__controls}>
                            <button onClick={() => scroll(-500, scollToRefReviews, 'reviews', 3)}
                                className={styles.slideshow__arrow}><Image src='/imgs/arrow-left.svg' alt=''
                                    width='14' height='11' /></button>
                            <MainSlideShowDots numberOfDots={0} slideShowPos={slideShowPos.reviews} />
                            <button onClick={() => scroll(500, scollToRefReviews, 'reviews', 3)}
                                className={styles.slideshow__arrow}><Image src='/imgs/arrow-right.svg' alt=''
                                    width='14' height='11' /></button>
                        </div>
                    </div>
                </MainLayout>
                <MainOverflowLayout>
                    <section className={styles.ref__card__container} ref={scollToRefReviews}>
                        <div className={styles.rev__card}>
                            <div className={styles.rev__userdetail}>
                                <Image src='/imgs/review1.svg' alt='' width='60' height='60' />
                                <div className={styles.rev__userdetail__inner}>
                                    <Image src='/imgs/reviewsd.svg' alt='' width='92' height='16' />
                                    <span className={styles.rev__user__font}>Robert Greynolds</span>
                                </div>
                            </div>
                            <p className={styles.rev__font}>This is a key factor for me to make quick decisions
                                especially strategizing multiple outs for investments. They allow me to focus on
                                properties that are best fit for me!</p>
                            <div className={styles.rev__play} onClick={() => openVideoModal(0)}>
                                <Image src='/imgs/playsmall.svg' alt='' width='44' height='44' />
                                <span>Watch a video review</span>
                            </div>
                        </div>
                        <div className={styles.rev__card}>
                            <div className={styles.rev__userdetail}>
                                <Image src='/imgs/review2.svg' alt='' width='60' height='60' />
                                <div className={styles.rev__userdetail__inner}>
                                    <Image src='/imgs/reviewsd.svg' alt='' width='92' height='16' />
                                    <span className={styles.rev__user__font}>Emma</span>
                                </div>
                            </div>
                            <p className={styles.rev__font}>Fetchit.ai was a game-changer for me in my search for a
                                short-term rental property. Their expert research and personalized service helped me
                                find the perfect investment while saving me time and stress.</p>
                            <div className={styles.rev__play} onClick={() => openVideoModal(1)}>
                                <Image src='/imgs/playsmall.svg' alt='' width='44' height='44' />
                                <span>Watch a video review</span>
                            </div>
                        </div>
                        <div className={styles.rev__card}>
                            <div className={styles.rev__userdetail}>
                                <Image src='/imgs/userd1.svg' alt='' width='60' height='60' />
                                <div className={styles.rev__userdetail__inner}>
                                    <Image src='/imgs/reviewsd.svg' alt='' width='92' height='16' />
                                    <span className={styles.rev__user__font}>Allen Rivera</span>
                                </div>
                            </div>
                            <p className={styles.rev__font}>Recommended. I&apos;ve used Fetchbnb to purchase my first
                                STR and could not be happier! I would not have known where to start.</p>
                        </div>
                    </section>
                </MainOverflowLayout>
                <section>
                    <MainLayout>
                        <div className={styles.referal__font__container}>
                            <span className={styles.main__smallfont}>People&apos;s choice</span>
                            <h3 className={styles.main__title}>Popular property</h3>
                        </div>
                    </MainLayout>
                    <MainLargerOverflowLayout>
                        <div className={styles.prop__card__container} ref={scollToRefProperties}>
                            <MainPreviewHouseCard entries={{
                                image: '/imgs/hp1.svg',
                                address: '15215 Thatcher Dr',
                                subaddress: 'Austin, TX 78717',
                                beds: 5,
                                baths: 4,
                                sqft: '4,190',
                                booked: 21,
                                dailyRate: 310,
                                price: '460,000'
                            }}
                            />
                            <MainPreviewHouseCard entries={{
                                image: '/imgs/hp2.svg',
                                address: '2505 Bluebonnet Ln',
                                subaddress: 'Austin, TX 78717',
                                beds: 3,
                                baths: 2,
                                sqft: '2,650',
                                booked: 21,
                                dailyRate: 237,
                                price: '680,000'
                            }}
                            />
                            <MainPreviewHouseCard entries={{
                                image: '/imgs/hp4.svg',
                                address: '733 N California St',
                                subaddress: 'Austin, TX 78717',
                                beds: 4,
                                baths: 3,
                                sqft: '1,935',
                                booked: 17,
                                dailyRate: 255,
                                price: '850,000'
                            }}
                            />
                        </div>
                        {isMobileState.width <= 948 ?
                            <div className={styles.properties__slider}>
                                <button onClick={() => scroll(-280, scollToRefProperties, 'properties', 3)}
                                    className={styles.slideshow__arrow}><Image src='/imgs/arrow-left.svg' alt=''
                                        width='14' height='11' /></button>
                                <MainSlideShowDots numberOfDots={3} slideShowPos={slideShowPos.properties} />
                                <button onClick={() => scroll(280, scollToRefProperties, 'properties', 3)}
                                    className={styles.slideshow__arrow}><Image src='/imgs/arrow-right.svg' alt=''
                                        width='14' height='11' /></button>
                            </div>
                            : <></>}
                        <div className={styles.properties__cta}>
                            <button className={styles.properties__cta__btn} onClick={() => router.push('/signup')}>See more</button>
                        </div>
                    </MainLargerOverflowLayout>
                </section>
            </div>
            <MainLayout>
                <section className={styles.pricing__box}>
                    <div className={styles.pricing__container}>
                        <h4 className={styles.pricing__title}>Fetchit Full Access</h4>
                        <span className={styles.price__font__1}>$53.50<span className={styles.price__font__2}>/month</span></span>
                        <button className={styles.price__button} onClick={() => router.push('/signup')}>Subscribe</button>
                        <div className={styles.price__font__container}>
                            <div className={styles.price__check__container}>
                                <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                                <span
                                    className={styles.price__check__font__bold}>Queries for Land, Houses, & Apartments</span>
                            </div>
                            <div className={styles.price__check__container}>
                                <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                                <span className={styles.price__check__font}>Total Property search</span>
                            </div>
                            <div className={styles.price__check__container}>
                                <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                                <span className={styles.price__check__font}>Short-term Rental Info</span>
                            </div>
                            <div className={styles.price__check__container}>
                                <Image src='/imgs/pricecheck.svg' alt='' width='16' height='16' />
                                <span className={styles.price__check__font}>Zoning and ordinance laws</span>
                            </div>
                        </div>
                        <Image className={styles.price__image__1} src='/imgs/priceemoji1.svg' width='89' height='90'
                            alt='' />
                        <Image className={styles.price__image__2} src='/imgs/priceemoji2.svg' width='64' height='62'
                            alt='' />
                    </div>
                    <div className={styles.price__maxfont}>
                        <span className={styles.price__small__side}>Pricing</span>
                        <h4 className={styles.price__title__side}>What are you looking for?</h4>
                        <p className={styles.price__subfont__side}>Why settle for mediocrity when our cutting-edge
                            short-term rental technology can help you make bank? Get the insider scoop on the latest
                            data and trends with our platform, and make bold moves to identify profitable
                            opportunities.</p>
                        <div className={styles.price__sub__button__container}>
                            <button onClick={() => router.push('https://calendly.com/yonatanwaxman/30min?month=2023-03')} className={styles.price__sub__button}>Schedule a call to learn more</button>
                        </div>
                    </div>
                </section>
            </MainLayout>
            <MainFooter />
        </>
    )
}

export default Homepage;