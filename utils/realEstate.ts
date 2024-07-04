import axios from "axios";
import { Property } from "../shared/interfaces/Property";
import { Filters } from '../shared/interfaces/Filters.d';

type RealEstateFilters = {
    minBed: number,
    maxBed: number,
    minBath: number,
    maxBath: number,
    propertyType: string,
    investorType: string,
}

const decideURL = (investorType: string) => {
    if (investorType.toLowerCase() === 'sublease') {
        return 'https://us-real-estate.p.rapidapi.com/v2/for-rent'
    }
    return 'https://us-real-estate.p.rapidapi.com/v2/for-sale'
}

const calcPropertyType = (propertyType: string, investorType: string) => {
    if (investorType.toLowerCase() !== "sublease") {
        if (propertyType.toLowerCase() === "house") {
            return "single_family,multi_family,mobile"
        } else if (propertyType.toLowerCase() === "land") {
            return "land"
        } else {
            return "single_family,multi_family,mobile"
        }
    } else {
        if (propertyType.toLowerCase() === "house") {
            return "single_family,townhome"
        } else {
            return "townhome,coop,apartment,condo,condop"
        }
    }
}

const limit = 40;

export const realEstate = async (usaState: string, city: string, filters: Filters) => {
    try {
        console.log("realEstat.ts")
        const options = {
            method: 'GET',
            url: decideURL(filters.investorType),
            params: {
                offset: filters.offset ? filters.offset * limit : 0,
                limit: filters.limit,
                state_code: usaState,
                city: city,
                sort: filters.sort,
                beds_min: filters.minBeds,
                baths_min: filters.minBaths,
                days_on_realtor: filters.daysOnMarket,
                property_type: calcPropertyType(filters.propertyType, filters.investorType),
                no_hoa_fee: filters.hasHoaFees,
                location: filters.zipCode,
                price_reduced: filters.reducedPrice,
                hide_foreclosure: filters.hideForeclosure,
                hoa_max: filters.hoaMax,
                // price_max: filters?.maxPrice ? filters?.maxPrice : ""
            },
            headers: {
                'X-RapidAPI-Key': 'd214dd74admsh775d5293948fb9bp1dc6b0jsncaf3a1b545e5',
                'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com'
            }
        };
        const response = await axios.request(options)
        // loop through and remove any land or nonland items depening on the filter
        const prev = response.data;
        // if (filters.propertyType === 'land' && filters.investorType !== 'sublease') {
        //     response.data.data.home_search.results = response.data.data.home_search.results.filter((item: Property) => item.description.sqft === 0);
        //     if (response.data.data.home_search.results.length === 0 || response.data.data.home_search.results.length === null) {
        //         return prev;
        //     }
        //     return response.data;
        // }
        // if (filters.propertyType === 'house' && filters.investorType !== 'sublease') {
        //     response.data.data.home_search.results = response.data.data.home_search.results.filter((item: Property) => item.description.sqft > 0);
        //     if (response.data.data.home_search.results.length === 0 || response.data.data.home_search.results.length === null) {
        //         return prev;
        //     }
        //     return response.data;
        // }
        console.log(response.data)
        if (response.data.data.home_search?.hasOwnProperty('results') === false) {
            response.data.data.home_search.results = []
        }
        return { ...response.data, customGeo: { stateCode: usaState, city }, offset: filters.offset, filters: filters.limit };
    } catch (e: any) {
        throw new Error(e.message);
    }
}