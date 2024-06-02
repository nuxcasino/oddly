import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCategories = () => {
    const query = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const responce = await client.api.categories.$get();
            if(!responce.ok){
                throw new Error("Failed to fetch categories");
            }
            const { data } = await responce.json();

            return data;
        }
    })

    return query;
}