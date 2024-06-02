import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAccounts = () => {
    const query = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const responce = await client.api.accounts.$get();
            if(!responce.ok){
                throw new Error("Failed to fetch accounts");
            }
            const { data } = await responce.json();

            return data;
        }
    })

    return query;
}