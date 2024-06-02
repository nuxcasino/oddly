import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCategory = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ["category", { id }],
        queryFn: async () => {
            const responce = await client.api.categories[":id"].$get({
                param: { id },
            });
            if(!responce.ok){
                throw new Error("Failed to fetch category");
            }
            const { data } = await responce.json();

            return data;
        }
    })

    return query;
}