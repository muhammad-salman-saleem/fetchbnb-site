export const numberWithCommas = (x: number) => {
    if (x !== null) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return "";
}

export const sqftFormat = (x: number| null) => {
    if (x === null) {
        return ""
    }
    return `${numberWithCommas(x)} sqft`
}

//function that takes in percentage integer and returns the number of days with that percentage within 31 days.
export const daysInMonth = (x: number) => {
    if(x === undefined || x === null) return 0;
    return Math.round((x / 100) * 30);
}

//estimates revenue based on nightly rate * occupancy rate. Could be wrong!
export const estRevenue = (nightlyRate: number, occ: number) => {
    if(nightlyRate === undefined || occ === undefined) return 0;
    return daysInMonth(occ) * nightlyRate;
}