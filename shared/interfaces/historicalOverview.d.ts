interface OccupancyData {
    date: any;
    year: number;
    month: number;
    value: number | null;
}

interface PriceData {
    date: any;
    year: number;
    month: number;
    value: number | null;
}

interface RevenueData {
    year: number;
    month: number;
    value: number | null;
}

type Occupancy = OccupancyData[];

type Price = PriceData[];

type Revenue = RevenueData[];

export interface HistoricalOverview {
    beds: number;
    occupancy: Occupancy | undefined;
    price: Price | undefined;
    revenue: Revenue | undefined;
}
