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
    
}