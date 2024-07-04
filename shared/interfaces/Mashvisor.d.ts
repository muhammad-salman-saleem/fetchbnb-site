export interface Mashvisor {
    status: string
    content: Content
  }
  
  export interface Content {
    median_home_value: number
    sample_size: number
    median_occupancy_rate: number
    median_rental_income: number
    median_night_rate: number
    adjusted_rental_income: number
    price_to_rent_ratio: number
    cash_flow: number
    cash_on_cash: number
    cap_rate: number
    expenses: number
    tax_rate: number
  }