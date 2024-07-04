import React from 'react'
import styles from '../styles/MoreFiltersInnerModal.module.css';

function numberWithCommas(x: number | undefined) {
    if (x === undefined) return "N/A";
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const MoreFiltersInnerModal: React.FC<{ values: any, setValues: any, closeModal: any, handleClick: any }> = ({ values, setValues, closeModal, handleClick }) => {

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const typeOfPrevValue = typeof values[key as keyof typeof values];
        if (typeOfPrevValue === 'number') {
            setValues({ ...values, [key]: parseInt(e.target.value) });
        } else {
            setValues({ ...values, [key]: e.target.value });
        }
    }
    return (
        <div className={styles.modal__overflow}>
            <h4 className={styles.title}>Cashflow Calculator</h4>
            <span className={styles.subtitle}>Fill the information below to estimate monthly cashflow.</span>
            <div className={styles.top}>
                <div className={styles.flex}>
                    <span className={styles.item__font}>Interest Rate</span>
                    <div className={styles.slidercontainer}>
                        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "interestRate")} type="range" min="0" max="100" value={values.interestRate} className={styles.slider} id="myRange" />
                        <span className={styles.slider__value}>{values.interestRate}%</span>
                    </div>
                </div>
                <div className={styles.flex}>
                    <span className={styles.item__font}>Down-Payment</span>
                    <div className={styles.slidercontainer}>
                        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "downPayment")} type="range" min="0" max="100" value={values.downPayment} className={styles.slider} id="myRange" />
                        <span className={styles.slider__value}>{values.downPayment}%</span>
                    </div>
                </div>
                <div className={styles.flex}>
                    <span className={styles.item__font}>Term Length</span>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "termLength")} value={values.termLength} type="number" className={styles.input} />
                </div>
                <span className={styles.annuel__font}>Annual Operating Expenses</span>
                <div className={styles.flex__multiple}>
                    <input placeholder="Landlord Insurance" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "landLord")} value={values.landLord} type="number" className={styles.input__multiple} />
                    <input placeholder="Property Taxes" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "propertyTaxes")} value={values.propertyTaxes} type="number" className={styles.input__multiple} />
                </div>
                <div className={styles.flex__multiple}>
                    <input placeholder="HOA Fees" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "hoaFees")} value={values.hoaFees} type="number" className={styles.input__multiple} />
                    <input placeholder="Estimated Maintence" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "estMaintenance")} value={values.estMaintenance} type="number" className={styles.input__multiple} />
                </div>
                <div className={styles.flex__wide}>
                    <input placeholder="Property Management Fee" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "propertyManagementFee")} value={values.propertyManagementFee} type="number" className={styles.input__wide} />
                    <input placeholder="Mortgage Expenses" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "MortageExpenses")} value={values.MortageExpenses} type="number" className={styles.input__wide} />
                    <input placeholder="Utilities" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "utilities")} value={values.utilities} type="number" className={styles.input__wide} />
                    <input placeholder="Other" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "annualOther")} value={values.annualOther} type="number" className={styles.input__wide} />
                    <input placeholder="Estimated Home Insurance" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "estimatedHomeInsurance")} value={values.estimatedHomeInsurance} type="number" className={styles.input__wide} />
                </div>
                <span className={styles.annuel__font}>Startup Costs</span>
                <div className={styles.flex__multiple}>
                    <input placeholder="Home Furnishings" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "homeFurnishing")} value={values.homeFurnishing} type="number" className={styles.input__multiple} />
                    <input placeholder="Improvements" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "improvements")} value={values.improvements} type="number" className={styles.input__multiple} />
                </div>
                <div className={styles.flex__multiple}>
                    <input placeholder="Closing Costs" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "closingCosts")} value={values.closingCosts} type="number" className={styles.input__multiple} />
                    <input placeholder="Other" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleValueChange(e, "startupOtheer")} value={values.startupOtheer} type="number" className={styles.input__multiple} />
                </div>
                <div className={styles.modal__bottom}>
                    <div>
                        <span>Estimated Cashflow</span>
                        <h4>${numberWithCommas(parseInt(values.cashFlow))}</h4>
                    </div>
                    <button onClick={() => { handleClick(); closeModal() }}>Calculate</button>
                </div>
            </div>
        </div>
    )
}

export default MoreFiltersInnerModal