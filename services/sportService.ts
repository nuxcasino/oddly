import { League, Sport, SportDTO, TopSportList, TopSportListDTO } from "@/types/sport";
import { Context } from "hono";

const URL = "https://1xlite-643419.top/service-api";

export const fetchSportsData = async (c: Context): Promise<SportDTO[]> => {
    const {langId, countryCode} = c.req.query();
    const lng = langId ? langId : "en";
    const country = countryCode ? countryCode : 19;
    const res = await fetch(`${URL}/LiveFeed/GetSportsShortZip?lng=${lng}&gr=285&country=${country}&groupChamps=true`);
    if (!res.ok) throw new Error("Failed to fetch data from provider");

    const data: any = await res.json();
    const sports: Sport[] = data.Value;

    return sports.map((sport: Sport) => ({
        SortId: sport.I,
        EGN: sport.E || sport.N,
        N: sport.N,
        EC: sport.C,
        LC: sport.CC,
        virtualSport: sport.ICY || false
    }));
};

//gettopsportslist
export const fetchTopSportsList = async(c: Context): Promise<TopSportListDTO[]> => {
    const {langId, countryCode} = c.req.query();
    const lng = langId ? langId : "en";
    const country = countryCode ? countryCode : 19;

    const res = await fetch(`${URL}/LineFeed/GetTopGamesStatZip?lng=${lng}&country=${country}&fcountry=${country}&gr=70&limit=10`);
    if (!res.ok) throw new Error("Failed to fetch data from provider");
    const data: any = await res.json();
    const topSports: TopSportList[] = data.Value;
    return topSports.map((sport: TopSportList) => ({
        Id: sport.ID,
        EC: sport.EC,
        EGN: sport.SE || sport.SN,
        N: sport.SN,
        SortId: sport.SI
        
    }))
}

export const getSportsByCountry = async(c: Context) => {
    const {langId, countryCode} = c.req.query();
    const lng = langId ? langId : "en";
    const country = countryCode ? countryCode : 19;
    const res = await fetch(`${URL}/LineFeed/GetSportsShortZip?sports=1&lng=bn&tf=2200000&tz=6&withCountries=true&country=19&virtualSports=true&gr=70`);
    if (!res.ok) throw new Error("Failed to fetch data from provider");
    const data: any = await res.json();
    const sports: Sport[] = data.Value;

    return sports.map((sport: Sport) => ({
        SortId: sport.I,
        EGN: sport.E || sport.N,
        N: sport.N,
        EC: sport.C,
        LC: sport.CC,
        virtualSport: sport.ICY || false,
        values: sport.L?.map((league: League) => ({
            SortId: sport.I,
            Id: league.CI,
            CNE: league.CE || league.CN,
            CN: league.CN,
            LI: league.LI,
            LN: league.L
        }))
    }));
}


export const getEventsById = async () => {
    //LiveFeed/Get1x2_VZip?sports=66&count=20&lng=en&gr=650&mode=4&country=19&partner=189&getEmpty=true&virtualSports=true&noFilterBlockEvent=true
}