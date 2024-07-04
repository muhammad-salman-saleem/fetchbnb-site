import axios from "axios";

export const ltr = async (address: string, beds: string, baths: string, sqft: number) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://realtymole-rental-estimate-v1.p.rapidapi.com/rentalPrice',
            params: {
                address: address,
                propertyType: 'Single Family',
                bedrooms: beds,
                bathrooms: baths,
                squareFootage: sqft,
            },
            headers: {
                'X-RapidAPI-Key': process.env.MASHVISOR_APIKEY,
                'X-RapidAPI-Host': 'realtymole-rental-estimate-v1.p.rapidapi.com'
            }
        };
        const response = await axios.request(options)
        return response.data;
    } catch (e: any) {
        console.log({ e })
        e.data = []
        return { e }
    }
};