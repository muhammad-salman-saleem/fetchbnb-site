import { HistoricalOverview } from "../shared/interfaces/historicalOverview";

const daysInMonth = (x: number | undefined) => {
    if (x === undefined || x === null || x === 1) return null;
    return Math.round((x / 100) * 30);
}

const historicalOverview = async (state: string, city: string): Promise<HistoricalOverview[]> => {

    let myHeaders = new Headers();
    myHeaders.append("x-api-key", "ac1528c1-4b42-470e-956b-46f89d252ef4");
    // myHeaders.append("X-RapidAPI-Host", "mashvisor-api.p.rapidapi.com");

    let requestOptions: any = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    //grab neighboorhood id
    const neighboorhoodIdRes = await fetch(`https://api.mashvisor.com/v1.1/client/city/neighborhoods/${state}/${city}`, requestOptions);
    const neighboorhoodIdData = await neighboorhoodIdRes.json();
    const neighborhood: number = neighboorhoodIdData?.content?.count !== 0 ? neighboorhoodIdData?.content?.results[0]?.id : undefined;

    const finalObject: HistoricalOverview[] = [
        {
            beds: 1,
            occupancy: undefined,
            price: undefined,
            revenue: undefined,
        },
        {
            beds: 2,
            occupancy: undefined,
            price: undefined,
            revenue: undefined,
        },
        {
            beds: 3,
            occupancy: undefined,
            price: undefined,
            revenue: undefined,
        },
    ]

    if (neighborhood === undefined) {
        return finalObject;
    }

    //search for each metric
    const searches = ["occupancy", "price", "revenue"];

    for (let i = 0; i < searches.length; i++) {
        const search = searches[i];
        for (let beds = 1; beds <= 3; beds++) {
            const url = `https://api.mashvisor.com/v1.1/client/neighborhood/${neighborhood}/historical/airbnb?average_by=${search}&state=${state}&beds=${beds}`;
            const res = await fetch(url, requestOptions);
            const data = await res.json();

            finalObject[beds - 1][search as keyof typeof finalObject[0]] = data?.content?.results;
        }
    }

    return finalObject;
}

export default historicalOverview;