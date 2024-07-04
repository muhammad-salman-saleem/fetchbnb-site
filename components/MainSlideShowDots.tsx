import React, { FC } from 'react'
import styles from '../styles/Homepage.module.css';

const MainSlideShowDots: FC<{ slideShowPos: number, numberOfDots: number }> = ({ slideShowPos, numberOfDots }) => {
    // slideShowPos is 1 - 4 inclusive
    // apply the selected dot style to the dot that corresponds to the slideShowPos

    const result = [];

    for (let i = 0; i < numberOfDots; i++) {
        result.push(<div key={i} className={slideShowPos === i + 1 ? styles.slideshow__selected__dot : styles.slideshow__dot} />)
    }
    return (
        <div className={styles.slideshow__dots}>
            {result}
        </div>
    )
}

export default MainSlideShowDots