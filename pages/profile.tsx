import React from 'react'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import { useSession, signIn, signOut } from 'next-auth/react'
import MainNavbar from '../components/MainNavbar'
import styles from '../styles/Profile.module.css';
import Layout from '../components/MainLayout'
//router
import { useRouter } from 'next/router'
import PlausibleProvider from 'next-plausible'
import NavbarAuthed from '../components/NavbarAuthed'
import Modal from 'react-modal';

export async function getServerSideProps(context: any) {
    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user: any = session?.user
    console.log(user, 'user')
    if (user === undefined) {
        return {
            redirect: {
                destination: '/pricing',
                permanent: false,
            }
        }
    }
    delete user.emailVerified;
    return {
        props: {
            user: user,
        },
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
        maxWidth: "550px",
        padding: "27px",
        borderRadius: "6px",
        background: '#FAFAFA',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'auto',
    }
}

const Profile: React.FC<any> = ({ user }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }


    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    const onClick = () => {
        openModal()
    }
    console.log({ user })
    const router = useRouter();
    const handleBillingClick = async () => {
        const res = await fetch('/api/customerportal', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        console.log(data, "data from stripe billing portal");
        if (res.status === 401) {
            openModal()
        } else {
            router.push(data.url)
        }
    }
    const handleActivationClick = async () => {
        const res = await fetch('/api/activateaccount');
        const data = await res.json();

    }

    return (
        <>
            <PlausibleProvider domain="fetchit.ai">
                <Modal
                    isOpen={isOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal" //itdas
                    overlayClassName={"overlay"}
                >
                    <div>
                        <p>An email was sent to {user.email}</p>
                        <p>
                            To our valued customer, if you wish to cancel your account, we are here to assist you through the process. Please direct your cancellation request to our dedicated customer service team at support@fetchit.ai please Include your account information in the email, and a brief explanation for your decision to cancel. This will allow us to serve you better and improve our product for future users. We assure you that your request will be handled promptly and professionally. Please remember, your feedback is vital to us and we are constantly striving to enhance our services. Thank you for your time and consideration.
                        </p>
                        <p>Don&apos;t have access to {user.email}? Send an email to yonatanwaxman@fetchit.ai for help.</p>
                    </div>
                </Modal>
                <NavbarAuthed />
                <Layout>
                    <h1 className={styles.title}>Profile</h1>
                    <div className={styles.btn}>
                        <button onClick={handleBillingClick} className={styles.button}>Manage Billing</button>
                        <button onClick={(() => signOut())} className={styles.button}>Sign Out</button>
                    </div>
                </Layout>
            </PlausibleProvider>
        </>
    )
}

export default Profile