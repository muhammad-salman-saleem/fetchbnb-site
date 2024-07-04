const axios = require("axios");

type HistoricalParams = {
    address: string,
    city: string,
    stateCode: string,
    zip: string,
    lat: number,
    lng: number,
    beds: string,
    baths: string,
    sqft: number
    resource: string
}

const historical = async ({ address, city, stateCode, zip, lat, lng, beds, baths, sqft, resource }: HistoricalParams) => {
    try {
        const params = { state: stateCode, address, city, zip_code: zip, lat, lng, beds, baths, resource: "airbnb", home_type: "single family residential" }
        console.log(params, "apar")
        const options = {
            method: 'GET',
            url: 'https://api.mashvisor.com/v1.1/client/rento-calculator/historical-performance',
            params: params,
            headers: {
                'x-api-key': "ac1528c1-4b42-470e-956b-46f89d252ef4",
            }
        };

        const response = await axios.request(options);
        const data = response.data;
        console.log({ data }, "aaaab")
        return data;
    } catch (error: any) {
        console.log("Error in historical.ts", { error: error.response })
        console.warn(error.response.data);
        return null;
    }
}

export default historical;