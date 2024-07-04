import React, { useContext, useEffect, useState } from 'react'
import LayoutDashboard from '../components/LayoutDashboard';
import NavbarAuthed from '../components/NavbarAuthed';
import Image from 'next/image';
import styles from '../styles/Va.module.css';
import DropDownWithSearch from '../components/DropDownWithSearch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainFooter from '../components/MainFooter';
import MainNavbar from '../components/MainNavbar';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
export async function getServerSideProps(context: any) {

    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user = session?.user
    if (user) {
        delete user.emailVerified;
    }
    return {
        props: {
            user: user || false
        },
    }
}

const VaItem: React.FC<{ title: string; desc: string; items: string[], imgUrl: string; onSelect: (x: string) => boolean }> = ({ title, desc, items, imgUrl, onSelect }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleButtonClick = () => {
        const selectedRes = onSelect(title);
        setIsSelected(selectedRes);
    }

    return (
        <div className={styles.va__wrapper}>
            <div className={styles.va__item__container}>
                <div className={styles.va__header}>
                    <h4>
                        {title}
                    </h4>
                    <Image src={imgUrl} alt='' width='33' height='33' />
                </div>
                <div className={styles.va__desc}>
                    {desc}
                </div>
                <div className={styles.va__checkmarks}>
                    {items.map((item, index) =>
                        <div className={styles.va__checkmark} key={index}>
                            <Image src='/imgs/vamark.svg' alt='' width='12' height='9' />
                            <span>{item}</span>
                        </div>
                    )}
                </div>
            </div>
            {isSelected === false ?
                <button className={styles.va__button__unselected} onClick={handleButtonClick}>Select</button>
                :
                <button className={styles.va__button__selected} onClick={handleButtonClick}>Selected</button>
            }
        </div>
    )
}

const Va: React.FC<{ user: any }> = ({ user }) => {
    console.log(user)
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAuthed, setIsAuthed] = useState(!!user)

    const handleSelect = (item: string): boolean => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
            return false;
        } else {
            setSelectedItems([...selectedItems, item]);
            return true;
        }
    }

    const onContinue = async () => {
        const res = await fetch('/api/varequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedItems
            })
        });
        const data = await res.json();
        router.push('https://calendly.com/workwithposeidon/fetch-it-30-min-discovery-meeting');
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <LayoutDashboard>
                        <NavbarAuthed />
                    </LayoutDashboard>
                </div>
                <LayoutDashboard isCentered={true}>
                    <div>
                        <span className={styles.small}>Find your VA</span>
                        <h1 className={styles.title}>Let Us <span>Handle</span> Your Property Seamlessly</h1>
                        <p className={styles.subtitle}>{'Experience Complete Peace of Mind with Our 24/7 Virtual Assistant Program for Airbnb Investors - Let Us Handle Everything from Guest Inquiries to Smart Home Management and Bookkeeping, So You Can Reclaim Your Time and Boost Your Rental Income!'}</p>
                    </div>
                </LayoutDashboard>
                <div className={styles.searchcontrol__container}>
                    <LayoutDashboard isCentered={true}>
                        <div className={styles.bar__container}>
                            <div className={styles.main__title__container}>
                                <h3>Select services you need</h3>
                                <span>{'Customize Your Support with Our Flexible Virtual Assistant Program - Choose the Services You Need and Enjoy Hassle-Free Airbnb Management!'}</span>
                                <div className={styles.va__parent}>
                                    <VaItem
                                        title="Airbnb Messaging Support"
                                        desc='This virtual assistant service for Airbnb hosts manages all guest messages and inquiries, allowing the host to be hands-off and stress-free. From initial booking to post-stay support, this service provides comprehensive guest communication management for investors.'
                                        items={['Timeliness', 'Clarity', 'Personalization', 'Issue Resolution']}
                                        imgUrl='/imgs/va1.svg'
                                        onSelect={handleSelect}
                                    />
                                    <VaItem
                                        title="Streamline Airbnb Tech Management"
                                        desc="Our service manages third-party property management tools like Guesty, Wheelhouse, and Price Labs (among others) streamlining Airbnb hosts' rental operations and optimizing their rental income."
                                        items={['Guesty', 'Wheelhouse', 'PriceLabs', 'PointCentral']}
                                        imgUrl='/imgs/va2.svg'
                                        onSelect={handleSelect}
                                    />
                                    <VaItem
                                        title="Accounting & Bookkeeping"
                                        desc='Our platform offers bookkeeping services, including report generation, bank liaison, and receipt storage, to streamline your rental operations and optimize your Airbnb investments. Our experienced team ensures accurate financial reports and secure receipt storage, giving you the insights you need to make informed decisions.'
                                        items={['Bookkeeping', 'Report Generation', 'Bank Liaison', 'Recipt Storage']}
                                        imgUrl='/imgs/va3.svg'
                                        onSelect={handleSelect}
                                    />
                                    <VaItem
                                        title="Effortless Smart Home Management"
                                        desc='Our virtual assistant service provides hassle-free management of your smart home devices, including locks, cameras, and more. With our support, you can easily monitor and control your smart home devices to enhance your security and simplify your daily routine.'
                                        items={['Security Cameras', '24/7 Chat Support', 'Door Locks', 'Smoke detection']}
                                        imgUrl='/imgs/va4.svg'
                                        onSelect={handleSelect}
                                    />
                                </div>
                            </div>
                            {selectedItems.length > 0 ?
                                <div className={styles.selected__wrapper}>
                                    <span className={styles.seleted__count}>{selectedItems.length} Selected</span>
                                    <button onClick={onContinue}>Continue</button>
                                </div>
                                : <></>}
                        </div>
                    </LayoutDashboard>
                    <Image className={styles.ppl__img} src='/imgs/people_coaching.svg' width='311' height='84' alt='' />
                </div>
                <LayoutDashboard>
                    <div className={styles.va__reviews}>
                        <div className={styles.va__review}>
                            <span className={styles.va__review__font}>&ldquo;Fetchit&apos;s VA&apos;s are top notch!&rdquo; </span>
                            <div className={styles.va__review__detail}>
                                <Image src='/imgs/vap1.svg' alt='' width='42' height='42' />
                                <span>Steven M</span>
                            </div>
                        </div>
                        <div className={styles.va__review}>
                            <span className={styles.va__review__font}>&ldquo;100% recommend Fetchit&apos;s VA&apos;s&rdquo; </span>
                            <div className={styles.va__review__detail}>
                                <Image src='/imgs/vap2.svg' alt='' width='42' height='42' />
                                <span>Marcy G</span>
                            </div>
                        </div>
                        <div className={styles.va__review}>
                            <span className={styles.va__review__font}>&ldquo;Seamless process from a to b, won&apos;t turn back&rdquo; </span>
                            <div className={styles.va__review__detail}>
                                <Image src='/imgs/vap3.svg' alt='' width='42' height='42' />
                                <span>Kate F</span>
                            </div>
                        </div>
                        <div className={styles.va__review}>
                            <span className={styles.va__review__font}>&ldquo;Don&apos;t hesitate and use them!&rdquo; </span>
                            <div className={styles.va__review__detail}>
                                <Image src='/imgs/vap4.svg' alt='' width='42' height='42' />
                                <span>Sharon H</span>
                            </div>
                        </div>
                    </div>
                </LayoutDashboard>
            </div>
            <MainFooter />
        </>
    )
}

export default Va;