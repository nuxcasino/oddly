'use client';
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetSports } from "@/features/sports/api/use-get-sports";


const SportsPage = () => {

  const sportsQuery = useGetSports();

  const  sports = sportsQuery.data || [];

  const isDisabled = sportsQuery.isLoading;



  if(sportsQuery.isLoading){
    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader>
                    <Skeleton className="h-8 max-w-screen" />
                </CardHeader>
                <CardContent>
                    <div className="h-[500px] w-full flex items-center justify-center">
                        <Loader2 className="size-6 text-slate-300 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }



  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">Sports</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable 
                    columns={columns} 
                    data={sports} 
                    filterKey="N"
                    disabled={isDisabled}
                    onDelete={() => {}}
                />
            </CardContent>
        </Card>
    </div>
  );
};

export default SportsPage;
