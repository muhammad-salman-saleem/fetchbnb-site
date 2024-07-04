import React from "react";
import { Filters } from "../shared/interfaces/Filters";

export type DefaultFilterContextType = {
    filters: Filters,
    search: string
};

const defaultFilters: DefaultFilterContextType = {
    search: '',
    filters: {
        investorType: "purchase",
        propertyType: "house",
        hasHoaFees: false,
        minBeds: 1,
        minBaths: 1,
        reducedPrice: false,
        hideForeclosure: false,
        hoaMax: '',
        zipCode: '',
        daysOnMarket: 0,
        sort: 'relevant'
    }
};
const defualtSetFilters: any = (x: Filters) => { };

export const FilterContext = React.createContext([defaultFilters, defualtSetFilters]);