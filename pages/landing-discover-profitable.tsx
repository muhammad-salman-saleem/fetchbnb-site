import React, { useEffect, useRef } from "react";
import styles from "../styles/LadingDiscoverProfitable.module.css";
import Image from "next/image";
import Link from "next/link";

const LadingDiscoverProfitable: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const playVideo = () => {
      if (!videoElement.paused && !videoElement.ended) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        playVideo();
      } else {
        videoElement.pause();
      }
    }, options);

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, []);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.nav}>
          <div>
            <Link href={"/"}>
              <Image
                src={"/imgs/fetchitLogo.png"}
                alt=""
                width={134}
                height={62}
              />
            </Link>
          </div>
          <div className={styles.account}>
            <button className={styles.my_account_button}>My Account </button>
          </div>
        </div>
        <div className={styles.main_section}>
          <section className={styles.section}>
            <div className={styles.side_content_section}>
              <h1 className={styles.side_content_heading}>
                Discover Profitable Airbnb`s with Our CEO - Only 3 Spots
                Remaining for Exclusive Strategy Call!
              </h1>
              <p className={styles.side_content_paragraph}>
                FetchIt AI technology finds you great short term rentals in
                seconds.
              </p>
              <button className={styles.side_content_button}>
                <Link
                  href={
                    "https://calendly.com/yonatanwaxman/30min?month=2023-07"
                  }
                >
                  {" "}
                  Book now!
                </Link>
              </button>
              <div className={styles.content_bar_above_image}>
                <Image
                  src={"/imgs/discover_profitable_person.png"}
                  alt=""
                  width={300}
                  height={250}
                />
              </div>
            </div>
            <div className={styles.side_image_section}>
              <div className={styles.side_image_section_1}>
                <div className={styles.side_image_1}>
                  <p className={styles.adr}>
                    ADR: $400 <br /> Occupancy Rate: 21 days
                  </p>
                </div>
              </div>
              <div className={styles.side_image_section_1}>
                <div className={styles.side_image_2}>
                  <p className={styles.adr}>
                    ADR: $515 <br /> Occupancy Rate: 26 days
                  </p>
                </div>
              </div>
              <div className={styles.side_image_section_1}>
                <div className={styles.side_image_3}>
                  <p className={styles.adr}>
                    ADR: $450 <br /> Occupancy Rate: 22 days
                  </p>
                </div>
              </div>
              <div className={styles.side_image_section_1}>
                <div className={styles.side_image_4}>
                  <p className={styles.adr}>
                    ADR: $600 <br /> Occupancy Rate: 23 days
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.section_2}>
            <div>
              <h1 className={styles.section_2_heading}>
                {`See What Our Customers Say About Fetchit!`.toUpperCase()}
              </h1>
            </div>

            <div className={styles.video_container}>
              <video
                ref={videoRef}
                id="video"
                className={styles.video}
                controls
                autoPlay
                muted
              >
                <source
                  src="/videos/discover_profitabl_video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default LadingDiscoverProfitable;
