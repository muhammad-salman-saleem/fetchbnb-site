export interface Ltr {
    latitude: number;
    longitude: number;
    rent: number;
    rentRangeHigh: number;
    rentRangeLow: number;
    listings: LtrListing[];
}

export interface LtrListing {
    id: string;
    formattedAddress: string;
    longitude: number;
    latitude: number;
    city: string;
    state: string;
    zipcode: string;
    price: number;
    publishedDate: string;
    distance: number;
    daysOld: number;
    correlation: number;
    address: string;
    county: string;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    squareFootage: number;
    lotSize: number;
    yearBuilt: number;
}