import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["transaction", { id }],
        queryFn: async () => {
            const responce = await client.api.transactions[":id"].$get({
                param: { id },
            });
            if(!responce.ok){
                throw new Error("Failed to fetch transaction");
            }
            const { data } = await responce.json();
            return {...data, amount: convertAmountFromMiliunits(data.amount)};
        }
    })

    return query;
}