export interface Filters {
  investorType: string,
  propertyType: string,
  hasHoaFees: boolean,
  minBeds: number,
  minBaths: number,
  reducedPrice: boolean,
  hideForeclosure: boolean,
  hoaMax: string,
  zipCode: string,
  daysOnMarket: number,
  sort: string,
  maxPrice?: string,
  offset?: number,
  limit?: number
}