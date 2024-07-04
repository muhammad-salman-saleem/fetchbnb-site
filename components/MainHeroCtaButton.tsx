import React, { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Homepage.module.css'
import { useRouter } from "next/router";
import Modal from "react-modal";
import ReactPlayer from 'react-player'




const MainHeroCtaButton: React.FC<{ videoOpenByDefault?: boolean }> = ({ videoOpenByDefault = false }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(videoOpenByDefault);


    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }


    const openVideoModal = () => {
        openModal();
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
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
            justifyContent: "center",
            zIndex: "5000",
        }
    }
    

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName={videoOpenByDefault === false ?("overlay") : "pureblackoverlay"}
            >
                <div>
                    {/* <video width="800px" height="500px" controls>
                        <source src="/videos/demo.mp4" type="video/mp4" />
                    </video> */}
                    <ReactPlayer
                        style={{
                            zIndex: 10000
                        }}
                        url={"/videos/demo.mp4"}
                        playing={true}
                        width={'800px'}
                        controls
                        height={'500px'}
                    />
                </div>
            </Modal>
            <div className={styles.hero__button__container}>
                <button className={styles.hero__cta__button} onClick={() => router.push('/signup')}>Get Started</button>
                <button className={styles.hero__video__button} onClick={() => openVideoModal()}><Image src='/imgs/play_btn.svg' width='53' height='53' alt='play button for video' /><span>Watch a demo</span></button>
            </div>
        </>

    )
}

export default MainHeroCtaButton