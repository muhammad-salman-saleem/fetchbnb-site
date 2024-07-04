import axios from "axios";

export const hotels = async (city: string) => {
    //get current date in yyyy-mm-dd format for checkin and checkout
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const checkin = yyyy + '-' + mm + '-' + dd;
    const checkout = yyyy + '-' + mm + '-' + (Number(dd) + 1);

    try {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd214dd74admsh775d5293948fb9bp1dc6b0jsncaf3a1b545e5',
                'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
            }
        };

        const response = await fetch('https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=Berlin&search_type=ALL', options);
        const data = await response.json();
        console.log(data);
        const ids: string[] = []
        let total = 0;
        let count = 0;
        const hotels = data;
        hotels.forEach((hotel: any) => {
            ids.push(hotel.id);
        });
        let secondPromises: any = []
        ids.forEach(async (id: string) => {
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'd214dd74admsh775d5293948fb9bp1dc6b0jsncaf3a1b545e5',
                    'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
                }
            };

            secondPromises.push(fetch('https://priceline-com-provider.p.rapidapi.com/v1/hotels/booking-details?date_checkout=' + checkout + '&date_checkin=' + checkin + '&hotel_id=' + id + '&rooms_number=1', options));
        });
        const responses = await Promise.all(secondPromises);
        secondPromises = [];
        responses.forEach(async (res) => {
            secondPromises.push(res.json());
        })

        const hotelData = await Promise.all(secondPromises);
        hotelData.forEach((hotel: any) => {
            count++;
            console.log(hotel.ratesSummary)
            total += parseFloat(hotel?.ratesSumary?.minPrice)
        });

        const amount = hotels.length;
        return {
            numberOfHotels: hotels.length,
            averagePrice: total / count
        };
    } catch (e: any) {
        // console.log({ e })
        e.data = []
        return { e }
    }
};