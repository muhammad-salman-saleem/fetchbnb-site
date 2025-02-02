// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

export interface Property {
    primary_photo: Photo;
    last_update_date: string;
    source: Source;
    tags: string[];
    permalink: string;
    status: string;
    list_date: string;
    open_houses: null;
    tax_record: TaxRecord;
    branding: Branding[];
    photos: Photo[];
    coming_soon_date: null;
    list_price: number;
    list_price_max?: number;
    list_price_min?: number;
    matterport: boolean;
    property_id: string;
    flags: Flags;
    lead_attributes: LeadAttributes;
    community: null;
    products: Products;
    results?: any;
    virtual_tours: null;
    description: Description;
    listing_id: string;
    price_reduced_amount: null;
    location: Location;
    other_listings: OtherListings;
}

export interface Branding {
    name: string;
    photo: null;
    type: string;
}

export interface Description {
    year_built: number;
    baths_3qtr: null;
    sold_date: string;
    sold_price: null;
    baths_full: number;
    name: null;
    baths_half: number;
    lot_sqft: null;
    sqft: number;
    baths: number;
    sub_type: null;
    baths_1qtr: null;
    garage: number;
    stories: number;
    beds: number;
    type: string;
}

export interface Flags {
    is_new_construction: null;
    is_subdivision: null;
    is_plan: null;
    is_price_reduced: null;
    is_pending: null;
    is_foreclosure: null;
    is_new_listing: boolean;
    is_coming_soon: null;
    is_contingent: null;
}

export interface LeadAttributes {
    show_contact_an_agent: boolean;
    opcity_lead_attributes: OpcityLeadAttributes;
    lead_type: string;
}

export interface OpcityLeadAttributes {
    flip_the_market_enabled: boolean;
    cashback_enabled: boolean;
}

export interface Location {
    address: Address;
    street_view_url: string;
    county: County;
}

export interface Address {
    postal_code: string;
    state: string;
    coordinate: Coordinate;
    city: string;
    state_code: string;
    line: string;
    county: County
}


export interface County {
    name: string;
    flips_code: string;
}


export interface Coordinate {
    lon: number;
    lat: number;
}

export interface County {
    fips_code: string;
    name: string;
}

export interface OtherListings {
    rdc: RDC[];
}

export interface RDC {
    listing_id: string;
    listing_key: null;
    status: string;
    primary: boolean;
}

export interface Photo {
    href: string;
}

export interface Products {
    products: string[];
    brand_name: string;
}

export interface Source {
    agents: Agent[];
    id: string;
    plan_id: null;
    spec_id: null;
    type: string;
}

export interface Agent {
    office_name: null;
}

export interface TaxRecord {
    public_record_id: string;
}