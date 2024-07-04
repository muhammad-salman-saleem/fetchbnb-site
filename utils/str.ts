import axios from "axios";

export const houseSearch = async (city: string, address: string, state: string, zip: number, beds: number, baths: number) => {
    try {
        const params = { state, resource: 'airbnb', beds, baths, zip_code: zip, address }
        let myHeaders = new Headers();
        myHeaders.append("x-api-key", "ac1528c1-4b42-470e-956b-46f89d252ef4");
        // myHeaders.append("X-RapidAPI-Host", "mashvisor-api.p.rapidapi.com");

        let requestOptions: any = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        // const response = await fetch(`https://mashvisor-api.p.rapidapi.com/rento-calculator/lookup?state=${state}&address=${address}&zip=${zip}&beds=${beds}&baths=${baths}`, requestOptions)
        // const response = await fetch(`https://mashvisor-api.p.rapidapi.com/rento-calculator/lookup?state=${state}&address=${address}&zip=${zip}&beds=${beds}&baths=${baths}`, requestOptions)
        const response = await fetch(`https://api.mashvisor.com/v1.1/client/rento-calculator/lookup?state=${state}&zip_code=${zip}&resource=airbnb&beds=${beds}&city=${city}&baths=${baths}`, requestOptions)
        const data = await response.json()



        return data
    } catch (e: any) {
        console.log(e, "ERROR STR")
    }
};