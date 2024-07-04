export interface ExtraInfo {
    ltr: Ltr;
    ordinance: { 
        ordinance: string[], 
        date: string, 
        location: {
            typeOfLocation: string, 
            locationName: string
        } 
    },
    hospitalDistance: number | undefined;
}