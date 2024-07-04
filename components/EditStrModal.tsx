import React from 'react'
import styles from '../styles/EditStrModal.module.css';

const daysInMonth = (x: number | undefined) => {
    console.log(x, "x")
    if (x === undefined || x === null || x === 1) return "N/A";
    return Math.round((x / 100) * 30);
}

const EditStrModal: React.FC<{ values: any, setValues: any, closeModal: any }> = ({ values, setValues, closeModal }) => {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const typeOfPrevValue = typeof values[key as keyof typeof values];
        if (typeOfPrevValue === 'number') {
            console.log("xxx", {target: e.target.value, booked: values.booked, estRev: parseInt(e.target.value) * (values.booked)})
            setValues({ ...values, [key]: parseInt(e.target.value), estRev: (daysInMonth(values.dailyRate) as number * (values.booked)) });
        } else {
            console.log("bere")
            setValues({ ...values, [key]: e.target.value, estRev: (daysInMonth(values.booked) as number * values.dailyRate) });
        }
    }

  return (
    <div className={styles.wrapper}>
        <span className={styles.title}>Edit</span>
        <span className={styles.subtitle}>Edit this information for<span className={styles.highlight}>&nbsp;Short Term Predictions.</span></span>
        <input placeholder="Estimated Daily Rate" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "dailyRate")} value={values.dailyRate} type="number" className={styles.input} />
        <div className={styles.flex}>
                    <span className={styles.item__font}>Est. Booked</span>
                    <div className={styles.slidercontainer}>
                        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "booked")} type="range" min="0" max="100" value={values.booked} className={styles.slider} id="myRange" />
                        <span className={styles.slider__value}>{values.booked}%</span>
                    </div>
                </div>
                <div className={styles.button__container}>
                <button onClick={closeModal}>Save</button>
                </div>
    </div>
  )
}

export default EditStrModal