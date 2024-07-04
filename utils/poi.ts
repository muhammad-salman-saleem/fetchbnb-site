import axios from 'axios';

export default async function ({ lat, lng }: { lat: number, lng: number }) {
    try {
        console.log({ lat, lng })
        const config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=96560&type=hospital&keyword="(general hospital) OR (hospital department) OR (emergency room) OR (hospital)"&key=${process.env.GOOGLE_PLACES_APIKEY as string}`,
            headers: {}
        };

        console.log(config, "config")

        const response = await axios(config);
        //calc distance
        const lat1 = response.data?.results[0]?.geometry?.location?.lat;
        const lon1 = response.data?.results[0]?.geometry?.location?.lng;
        const lat2 = lat;
        const lon2 = lng;
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres
        const miles = Math.ceil(d * 0.00062137119)
        if (miles > 10) {
            console.log('returning null')
            return null
        }
        return miles;
    } catch (e) {
        console.log(e);
    }
}