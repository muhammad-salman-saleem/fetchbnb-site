import React from 'react'
import FilterDropDown from './FilterDropDown'
import styles from '../styles/FilterDropDowns.module.css';
import { Filters } from '../shared/interfaces/Filters.d';


const FilterDropDowns: React.FC<{filters: Filters, handleChange: any}> = ({filters, handleChange}) => { 
    return (
        <div className={styles.dropdowns}>
            <FilterDropDown filters={filters} handleChange={handleChange} filterKey='investorType' options={['Purchase', 'Sublease']} />
            <FilterDropDown filters={filters} handleChange={handleChange} filterKey='propertyType' options={['House', 'Apartment', 'Land']} />
            <FilterDropDown filters={filters} handleChange={handleChange} options={[]} isModal/>
        </div>
    )
}

export default FilterDropDowns