import Image from 'next/image'
import styles from '../styles/Login.module.css';
import React, { FC, useState, useEffect } from 'react'
import Layout from '../components/oldSite/Layout'
import MainNavbar from '../components/MainNavbar'
import Link from 'next/link'
import SmallText from '../components/oldSite/SmallText'
import PlausibleProvider from 'next-plausible';
import GoogleAds from '../components/oldSite/GoogleAds';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import MainLayout from '../components/MainLayout';
import { parseJsonSourceFileConfigFileContent } from 'typescript';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import Cookies from 'universal-cookie';


//type Data = { csrfToken: any, providers: any }

export const getServerSideProps = async (ctx: any) => {
    let csrfToken: any = await getCsrfToken(ctx)
    const providers = await getProviders()
    if (csrfToken === undefined) {
        csrfToken = null
    }

    let x = {
        test: "test"
    }
    return {
        props: { data: { csrfToken, providers } }
    }
}

type GenderSelectorProps = {
    gender: string,
    setGender: (gender: string) => void
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ gender, setGender }) => {

    const updateMale = () => {
        setGender("male")
    }

    const updateFemale = () => {
        setGender("female")
    }

    if (gender === "female") {
        return (
            <div className={styles.gender__container}>
                <div onClick={updateMale} className={styles.gender__item}>
                    <span>Male</span>
                </div>
                <div onClick={updateFemale} className={styles.gender__item__selected}>
                    <span>Female</span>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.gender__container}>
            <div onClick={updateMale} className={styles.gender__item__selected}>
                <span>Male</span>
            </div>
            <div onClick={updateFemale} className={styles.gender__item}>
                <span>Female</span>
            </div>
        </div>
    )
}

type UserDescriptionSelectorProps = {
    userDesc: string,
    setUserDesc: (x: string) => void,
    displaySelected?: boolean,
    pushBackIndex?: () => void
}

const UserDescriptionSelector: React.FC<UserDescriptionSelectorProps> = ({ userDesc, setUserDesc, displaySelected = false, pushBackIndex }) => {
    const possibleStrings = {
        str: "Short Term Rental Investor",
        ltr: "Long Term Rental Investor",
        rookie: "Rookie Rental Investor",
        other: "Other"
    }
    if (displaySelected === true) {
        return (
            <div className={styles.description__finalized__container}>
                <div onClick={pushBackIndex} className={styles.description__item__selected}>
                    <span>{possibleStrings[userDesc as keyof typeof possibleStrings]}</span>
                </div>
                <span>Selected</span>
            </div>
        );
    }
    return (
        <div className={styles.description__wrapper}>
            <div className={styles.description__container}>
                <div onClick={() => setUserDesc("str")} className={(() => {
                    if (userDesc === "str") {
                        return styles.description__item__selected
                    } else {
                        return styles.description__item

                    }
                })()}>
                    <span>Short Term Rental Investor</span>
                </div>
                <div onClick={() => setUserDesc("ltr")} className={(() => {
                    if (userDesc === "ltr") {
                        return styles.description__item__selected
                    } else {
                        return styles.description__item

                    }
                })()}>
                    <span>Long Term Rental Investor</span>
                </div>
            </div>
            <div className={styles.description__container}>
                <div onClick={() => setUserDesc("rookie")} className={(() => {
                    if (userDesc === "rookie") {
                        return styles.description__item__selected
                    } else {
                        return styles.description__item

                    }
                })()}>
                    <span>Rookie Rental Investor</span>
                </div>
                <div onClick={() => setUserDesc("other")} className={(() => {
                    if (userDesc === "other") {
                        return styles.description__item__selected
                    } else {
                        return styles.description__item

                    }
                })()}>
                    <span>Other</span>
                </div>
            </div>
        </div>
    )
}

type PropertyLocationsProps = {
    propertyLocations: string[],
    setPropertyLocations: any
}

const PropertyLocations: React.FC<PropertyLocationsProps> = ({ propertyLocations, setPropertyLocations }) => {

    const updateInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setPropertyLocations((prev: string[]) => {
            const updatedArr = [...prev];
            updatedArr[index] = e.target.value;
            return updatedArr;
        });
    }

    const addInput = () => {
        setPropertyLocations((prev: string[]) => {
            return [...prev, ""];
        });
    }

    return (
        <div>
            <div className={styles.propertyloc__inputs}>
                {propertyLocations.map((value, index) => (
                    <div key={index} className={styles.propertloc__input__wrapper}>
                        <input placeholder='Los Angeles, CA' className={styles.propertyloc__input} key={index} type="text" value={value} onChange={(e) => updateInput(e, index)} />
                        <Image className={styles.propertloc__pinimg} src='/imgs/signup_pin.svg' alt='' width='19' height='19' />
                    </div>
                ))}
            </div>
            <button className={styles.propertyLoc__button} onClick={addInput}>
                Add more
                <Image src='/imgs/signup_plus.svg' width='22' height='22' alt='' />
            </button>
        </div>
    );
}

type QuizProps = {
    csrfToken: any,
    index: number,
    inc: (number?: number) => void,
    updateQuiz: (entryType: boolean, { }: any, quizDone: boolean) => void
}
const Quiz: React.FC<QuizProps> = ({ csrfToken, index, inc, updateQuiz }) => {
    const router = useRouter();
    const [error, setError] = useState<any>(null); //error for signup form
    const [accountType, setAccountType] = useState(false); //error for signup form
    const [gender, setGender] = useState("male");
    const [userDesc, setUserDesc] = useState("str");
    const [propertyLocations, setPropertyLocations] = useState([""]);
    const [freeTrial, setFreeTrial] = useState<string | boolean>(false);
    const { data: session } = useSession()
    useEffect(() => {
        if ((router.query?.authed && index === 1) || (router.query?.authed && index === 0)) {
            inc(2);
        }
    }, [router.query])

    useEffect(() => {
        const cookies = new Cookies()
        const isHostConCookie = cookies.get('isHostCon')
        if (isHostConCookie === "true") {
            setFreeTrial(true)
        }
    }, [])

    //code from https://raz-levy.medium.com/upload-images-to-aws-s3-using-react-js-and-node-js-express-server-bc15b959372c
    const convertToBase64 = (file: any) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
        })
    }


    const onImageSelectFile = async (event: any) => {
        const file = event.target.files[0];
        const convertedFile = await convertToBase64(file);
        const s3URL = await axios.post(
            '/api/uploadavatar',
            {
                image: convertedFile,
                imageName: file.name
            }
        );
    }

    const pushBackIndex = () => {
        inc(index - 1);
    }

    const pushToPricing = async () => {
        if (session) {
            let userSession: any = session?.user
            console.log(userSession, 'userSession')
            if (userSession?.plan !== 'TRIAL' && userSession?.plan !== 'UNPAID') {
                const res = await fetch('/api/customerportal', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json()
                return router.push(data.url)
            }
            console.log('here PAYMENT', process.env.NEXT_PUBLIC_STRIPE_PRODUCT_4)

            const cookies = new Cookies()
            const ref = cookies.get('ref')
            const res = await fetch('/api/createcheckoutsession', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_4,
                    customerId: userSession?.customerId,
                    needsTrial: freeTrial,
                    ref
                })
            })
            const data = await res.json()
            console.log(data)
            router.push(data.url)
        } else {
            console.log('here PAYMENT UNAUTHED')
            router.push('/signup')
        }
    }

    const finishQuiz = (accountType: boolean) => {
        /**
         * possible quiz options
         * {
            phone: "",
            zip: "",
            airbnbProfileLink: "",
            gender: "male",
            description: [],
            propertyLocations: []
        }
         * 
         */
        updateQuiz(accountType, {
            gender: gender,
            description: userDesc,
            propertyLocations: propertyLocations
        }, true)
        // this could later be changed to a push to the demo page
        pushToPricing();
    }

    if (index === 0) {
        return (
            <div className={styles.main__container}>
                <h1 className={styles.title}>Create an account</h1>
                <span className={styles.subtitle}>Select your account type</span>
                <div className={styles.type__buttons}>
                    <button className={styles.ind__button} onClick={() => { setAccountType(false); inc() }}>Individual</button>
                    <button className={styles.bus__button} onClick={() => { setAccountType(true); inc() }}>Business</button>
                </div>
            </div>
        );
    }
    if (accountType === false) {
        if (index === 1) {
            return (
                <div className={styles.main__container}>
                    <h1 className={styles.title}>Create an account</h1>
                    <span className={styles.subtitle}>Let&apos;s get started!</span>
                    <Formik
                        initialValues={{ email: '', password: '', name: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Invalid email address')
                                .required('Please enter your email'),
                            password: Yup.string().required('Please enter your password'),
                            name: Yup.string().required("Please enter your name")
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: values.email,
                                    password: values.password,
                                    name: values.name
                                }),
                            }
                            const response = await fetch('/api/auth/signup', options);
                            const data = await response.json();
                            let otherOptions = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: values.email,
                                }),
                            }
                            if (response.status === 203) {
                                console.log("emial", values.email)
                                return setError("Email already exists");

                            }
                            console.log("ran before signin")
                            // if (data) {
                            //     router.push('/login');
                            // }
                            const res = await signIn('credentials', {
                                redirect: false,
                                email: values.email,
                                password: values.password,
                                callbackUrl: '/signup?authed=true',
                            });
                            if (res?.error) {
                                setError(res.error);
                            } else {
                                setError(null);
                                router.push('/signup?authed=true');
                            }
                            values.email = "";
                            values.password = "";
                            setSubmitting(false);
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div
                                    className="bg-red-400 flex flex-col items-center 
    justify-center min-h-screen py-2 shadow-lg">
                                    <div>
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />

                                        <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                            {error}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="name"
                                                    aria-label="enter your name"
                                                    aria-required="true"
                                                    placeholder="Full Name"
                                                    type="text"
                                                    style={{
                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="name" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="email"
                                                    aria-label="enter your email"
                                                    aria-required="true"
                                                    placeholder="Email"
                                                    type="text"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="email" />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label
                                                htmlFor="password"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="password"
                                                    aria-label="enter your password"
                                                    aria-required="true"
                                                    type="password"
                                                    placeholder="Password"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                                <ErrorMessage name="password" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="submit"
                                                style={{
                                                    border: "none",
                                                    width: "370px",
                                                    height: "48px",
                                                    fontFamily: 'TT Interfaces',
                                                    fontStyle: "normal",
                                                    fontWeight: "600",
                                                    fontSize: "18px",
                                                    lineHeight: "140%",
                                                    color: "#FFFFFF",
                                                    background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                                                    borderRadius: "8px",
                                                    marginTop: "16px"
                                                }}
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Next'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                    <div className={styles.divider}>
                        <div className={styles.hr} />
                        <span>Or</span>
                        <div className={styles.hr} />
                    </div>
                    <div className={styles.auth__providers}>
                        <button onClick={() => signIn('google', { callbackUrl: '/signup?authed=true', redirect: false })} ><Image src='/imgs/google_login.svg' alt='' width='41' height='41' /></button>
                        {/* <button><Image src='/imgs/facebook_login.svg' alt='' width='41' height='41' /></button> */}
                        {/* <button><Image src='/imgs/apple_login.svg' alt='' width='41' height='41' /></button> */}
                        {/* <button><Image src='/imgs/twitter_logo.svg' alt='' width='41' height='41' /></button> */}
                    </div>
                </div>
            );
        } else if (index === 2) {
            return (
                <div className={styles.main__container}>
                    <h1 className={styles.title}>Create an account</h1>
                    <span className={styles.subtitle}>A few more details...</span>
                    <Formik
                        initialValues={{ phone: '', zip: '', airbnbLink: '', email: "", password: "" }}
                        validationSchema={Yup.object({
                            phone: Yup.number().required('Phone number required').min(10, "Phone number invalid"),
                            zip: Yup.number().required('Zipcode required'),
                            airbnbLink: Yup.string()
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true)
                            updateQuiz(false, {
                                phone: values?.phone, zip: values?.zip, airbnbProfileLink: values?.airbnbLink, gender: gender
                            }, false)
                            setSubmitting(false)
                            inc();
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div
                                    className="bg-red-400 flex flex-col items-center 
    justify-center min-h-screen py-2 shadow-lg">
                                    <div>
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />

                                        <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                            {error}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="phone"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="phone"
                                                    aria-label="Enter Phone Number"
                                                    aria-required="true"
                                                    placeholder="Phone Number"
                                                    type="number"
                                                    style={{
                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="zip"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="zip"
                                                    id="zip"
                                                    aria-label="enter your zipcode"
                                                    aria-required="true"
                                                    autoFill="off"
                                                    placeholder="Zipcode"
                                                    type="text"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="zip" />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label
                                                htmlFor="airbnbLink"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="airbnbLink"
                                                    aria-label="enter your airbnbLink"
                                                    aria-required="true"
                                                    id="airbnb"
                                                    autoFill="off"
                                                    type="text"
                                                    placeholder="Airbnb Profile Link"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                                <ErrorMessage name="airbnbLink" />
                                            </div>
                                        </div>
                                        <GenderSelector setGender={setGender} gender={gender} />
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="submit"
                                                style={{
                                                    border: "none",
                                                    width: "370px",
                                                    height: "48px",
                                                    fontFamily: 'TT Interfaces',
                                                    fontStyle: "normal",
                                                    fontWeight: "600",
                                                    fontSize: "18px",
                                                    lineHeight: "140%",
                                                    color: "#FFFFFF",
                                                    background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                                                    borderRadius: "8px",
                                                    marginTop: "16px"
                                                }}
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Next'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            );
        } else if (index === 3) {
            return (
                <div className={styles.main__container}>
                    <h1 className={styles.title}>Create an account</h1>
                    <span className={styles.subtitle}>Final Details</span>
                    {/* <div className={styles.photo__container}>
                        <div className={styles.photo__selector}>
                            <label htmlFor="file-upload" className={styles.photo__input}>
                                <Image src='/imgs/photo_selector.svg' alt='' width='87' height='87' />
                            </label>
                            <input id="file-upload" type="file" accept="image/*" className={styles.photo__input__hidden} onChange={onImageSelectFile} />
                        </div>
                        <div>
                            <span>Profile Photo</span>
                        </div>
                    </div> */}
                    <div className={styles.desc__container}>
                        <span className={styles.desc__font}>What describes you</span>
                        <UserDescriptionSelector userDesc={userDesc} setUserDesc={setUserDesc} />
                    </div>
                    <button
                        type="submit"
                        style={{
                            border: "none",
                            width: "370px",
                            height: "48px",
                            fontFamily: 'TT Interfaces',
                            fontStyle: "normal",
                            fontWeight: "600",
                            fontSize: "18px",
                            lineHeight: "140%",
                            color: "#FFFFFF",
                            background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                            borderRadius: "8px",
                            marginTop: "16px"
                        }}
                        onClick={() => inc()}
                    >
                        Next
                    </button>
                </div>
            );
        } else if (index === 4) {
            return (
                <div className={styles.main__container}>
                    <h1 className={styles.title}>Create an account</h1>
                    <span className={styles.subtitle}>Additional Information</span>
                    <div className={styles.desc__container}>
                        <UserDescriptionSelector userDesc={userDesc} setUserDesc={setUserDesc} displaySelected pushBackIndex={pushBackIndex} />
                    </div>
                    <span className={styles.subtitle}>Location of Your Properties</span>
                    <div>
                        <PropertyLocations propertyLocations={propertyLocations} setPropertyLocations={setPropertyLocations} />
                    </div>
                    <button
                        type="submit"
                        style={{
                            border: "none",
                            width: "370px",
                            height: "48px",
                            fontFamily: 'TT Interfaces',
                            fontStyle: "normal",
                            fontWeight: "600",
                            fontSize: "18px",
                            lineHeight: "140%",
                            color: "#FFFFFF",
                            background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                            borderRadius: "8px",
                            marginTop: "16px"
                        }}
                        onClick={() => finishQuiz(false)}
                    >
                        Create Account
                    </button>
                </div>
            );
        }
    } else {
        if (index === 1) {
            return (
                <div className={styles.main__container}>
                    <h1 className={styles.title}>Create an account</h1>
                    <span className={styles.subtitle}>Let&apos;s get started!</span>
                    <Formik
                        initialValues={{ email: '', password: '', name: '' }}
                        validationSchema={Yup.object({
                            email: Yup.string()
                                .email('Invalid email address')
                                .required('Please enter your email'),
                            password: Yup.string().required('Please enter your password'),
                            name: Yup.string().required("Please enter your name")
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            const options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: values.email,
                                    password: values.password,
                                    name: values.name
                                }),
                            }
                            const response = await fetch('/api/auth/signup', options);
                            const data = await response.json();
                            let otherOptions = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    email: values.email,
                                }),
                            }
                            if (response.status === 203) {
                                console.log("emial", values.email)
                                return setError("Email already exists");

                            }
                            console.log("ran before signin")
                            // if (data) {
                            //     router.push('/login');
                            // }
                            const res = await signIn('credentials', {
                                redirect: false,
                                email: values.email,
                                password: values.password,
                                callbackUrl: '/signup?authed=true',
                            });
                            if (res?.error) {
                                setError(res.error);
                            } else {
                                setError(null);
                                router.push('/signup?authed=true');
                            }
                            values.email = "";
                            values.password = "";
                            setSubmitting(false);
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div
                                    className="bg-red-400 flex flex-col items-center 
    justify-center min-h-screen py-2 shadow-lg">
                                    <div>
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />

                                        <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                            {error}
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="name"
                                                    aria-label="enter your name"
                                                    aria-required="true"
                                                    placeholder="Company Name"
                                                    type="text"
                                                    style={{
                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="name" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                htmlFor="email"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="email"
                                                    aria-label="enter your email"
                                                    aria-required="true"
                                                    placeholder="Company Email"
                                                    type="text"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ fontSize: "12px", color: "#ff726b" }}>
                                                <ErrorMessage name="email" />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label
                                                htmlFor="password"
                                                style={{ display: "flex", flexDirection: "column" }}
                                            >
                                                <Field
                                                    name="password"
                                                    aria-label="enter your password"
                                                    aria-required="true"
                                                    type="password"
                                                    placeholder="Password"
                                                    style={{

                                                        background: "#FFFFFF",
                                                        border: "1px solid #E4E4F9",
                                                        borderRadius: "12px",
                                                        maxWidth: "370px",
                                                        fontFamily: 'TT Interfaces',
                                                        fontStyle: "normal",
                                                        fontWeight: "500",
                                                        fontSize: "18px",
                                                        lineHeight: "140%",
                                                        color: "#6B6B82",
                                                        padding: "12px 16px",
                                                        marginTop: "16px"
                                                    }}
                                                />
                                            </label>

                                            <div style={{ color: "#ff726b", fontSize: "12px" }}>
                                                <ErrorMessage name="password" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <button
                                                type="submit"
                                                style={{
                                                    border: "none",
                                                    width: "370px",
                                                    height: "48px",
                                                    fontFamily: 'TT Interfaces',
                                                    fontStyle: "normal",
                                                    fontWeight: "600",
                                                    fontSize: "18px",
                                                    lineHeight: "140%",
                                                    color: "#FFFFFF",
                                                    background: "linear-gradient(264.03deg, #5271FF 0%, #95FFFF 201.92%)",
                                                    borderRadius: "8px",
                                                    marginTop: "16px"
                                                }}
                                            >
                                                {formik.isSubmitting ? 'Please wait...' : 'Create'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                    <div className={styles.divider}>
                        <div className={styles.hr} />
                        <span>Or</span>
                        <div className={styles.hr} />
                    </div>
                    <div className={styles.auth__providers}>
                        <button onClick={() => signIn('google', { callbackUrl: '/signup?authed=true', redirect: false })} ><Image src='/imgs/google_login.svg' alt='' width='41' height='41' /></button>
                        {/* <button><Image src='/imgs/facebook_login.svg' alt='' width='41' height='41' /></button> */}
                        {/* <button><Image src='/imgs/apple_login.svg' alt='' width='41' height='41' /></button> */}
                        {/* <button><Image src='/imgs/twitter_logo.svg' alt='' width='41' height='41' /></button> */}
                    </div>
                </div>
            );
        } else {
            router.push('/pricing');
        }
    }

    return <></>
}

const Login = ({ data }: any) => {
    let csrfToken = data.csrfToken
    // console.log(data)
    const [quizIndex, setQuizIndex] = useState(0);
    const [indQuizEntries, setIndQuizEntires] = useState({
        phone: "",
        zip: "",
        airbnbProfileLink: "",
        gender: "male",
        description: "str",
        propertyLocations: []

    });
    const [busQuizEntries, setBusQuizEntires] = useState({
        companyLocation: ""
    });

    const updateQuizEntires = (entryType: boolean, changes: {}, quizDone?: boolean) => {
        const submit = async (finalQuizState: any) => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalQuizState),
            }
            const res = await fetch('/api/setquiz', options);
            const data = await res.json();
        }
        if (entryType === false) {
            setIndQuizEntires(prev => {
                submit({ ...prev, ...changes });
                return { ...prev, ...changes }
            })
        } else {
            setBusQuizEntires(prev => {
                submit({ ...prev, ...changes });
                return { ...prev, ...changes }
            })
        }
    }

    const incQuiz = (number?: number) => {
        if (number) {
            setQuizIndex(number);
        } else {
            setQuizIndex(prev => prev + 1);
        }
    }

    return (
        <>
            <GoogleAds />
            <PlausibleProvider domain="fetchit.ai">
                <div className={styles.wrapper}>
                    <section className={styles.container}>
                        <div className={styles.auth__side}>
                            <MainLayout>
                                <MainNavbar page="authpage" />
                                <Quiz inc={incQuiz} index={quizIndex} csrfToken={csrfToken} updateQuiz={updateQuizEntires} />
                            </MainLayout>
                        </div>
                        <div className={styles.map__side}>
                            <Image src='/imgs/logincard.svg' width='374' height='319' alt='' />
                            <Image src='/imgs/logindots.svg' width='62' height='8' alt='' />
                            <h4 className={styles.map__title}>Short-Term Rental Predictions</h4>
                            <span className={styles.map__subtitle}>Say goodbye to confusion and hello to profits with our LIVE short term rental predictions for for-sale listings.</span>
                        </div>
                    </section>
                    <span className={styles.altauth}>Don`t have an account? <Link className={styles.altlink} href='/login'>Log In</Link></span>
                </div>
            </PlausibleProvider>
        </>
    )
}

export default Login