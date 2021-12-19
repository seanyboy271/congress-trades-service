export interface SenateData{
    entries:SenateEntry[]
}

export interface SenateEntry{
    transaction_date:string,
    owner:string,
    ticker:string,
    asset_description:string,
    asset_type:string,
    type:string,
    amount:string,
    comment:string,
    senator:string,
    ptr_link:string,
    disclosure_date: string
}

export interface HouseData{
    entries: HouseEntry[]
}

export interface HouseEntry{
    disclosure_year:string,
    disclosure_date:string,
    transaction_date:string,
    owner:string,
    ticker:string,
    asset_description:string,
    type:string,
    amount:string,
    representative:string,
    district:string,
    ptr_link:string,
    cap_gains_over_200_usd:boolean
}