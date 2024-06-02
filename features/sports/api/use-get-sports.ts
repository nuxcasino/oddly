import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetSports= () => {
    const params = useSearchParams();
    const live = params.get("live") || "";
    const langId = params.get("langId") || "en";
    const partnerId = params.get("partnerId") || "";
    const countryCode = params.get("countryCode") || "19";
    const query = useQuery({
        queryKey: ["sports", { live, langId, partnerId, countryCode}],
        queryFn: async () => {
            const responce = await client.api.sport.v1.sports.$get({
                query: { live, langId, partnerId, countryCode}
            });
            if(!responce.ok){
                throw new Error("Failed to fetch transactions");
            }
            const { data } = await responce.json();

            return data;
        },
        retry: 3,  
        refetchInterval: (1000*10), 
    })

    return query;
}