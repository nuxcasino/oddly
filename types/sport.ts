export interface Sport {
    I: number; // id of the sport
    E?: string; // english name (optional)
    N: string; // transelet name
    C: number; // event count
    CC: number; // league count
    ICY?: boolean; // virtual sport indicator (optional)
    L?: League[];
}
export interface SportDTO {
    SortId: number; 
    EGN: string; 
    N: string; 
    EC: number; 
    LC: number; 
    virtualSport: boolean; 
}


export interface League{
    CE?: string,
    CI: number,
    CN: string,
    GC: number,
    L: string, 
    LI: number, 
}


export interface LeagueDTO{
    LI: number,
    LN: string,
    EGN: string,
    CountryID: number,
    N: string,
    GC: number,
}


export interface TopSportList {
    ID: number;
    SE?: string;
    SN: string;
    EC: number;
    SI: number;
}

export interface TopSportListDTO {
    Id: number;
    SortId: number; 
    N: string; 
    EGN: string; 
    EC: number; 
}