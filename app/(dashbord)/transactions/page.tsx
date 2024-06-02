'use client';
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { transactions as transactionSchema } from "@/db/schema"

import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = {
    data: [],
    error: [],
    meta: {},
};


const TransactionsPage = () => {

  const [AccountDialog, confirm ] = useSelectAccount();

  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults,  setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const { onOpen } = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();

  const  transactions = transactionsQuery.data || [];

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (values: typeof transactionSchema.$inferInsert[]) => {
    const accountId = await confirm();
    if(!accountId){
        return toast.error("Please select an account to continue");
    }
    const data = values.map((value) => ({
        ...value,
        accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
        onSuccess: () => {
            onCancelImport();
        },
    });
  }

  if(transactionsQuery.isLoading){
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

  if(variant === VARIANTS.IMPORT){
    return(
        <>
            <AccountDialog />
            <ImportCard 
                data={importResults.data}
                onCancel={onCancelImport}
                onSubmit={onSubmitImport}
            />
        </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>

                <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                    <Button size={"sm"} className="w-full lg:w-auto" onClick={onOpen}>
                        <Plus className="size-4 mr-2" />
                        Add New
                    </Button>
                    <UploadButton onUpload={onUpload} />
                </div>
            </CardHeader>
            <CardContent>
                <DataTable 
                    columns={columns} 
                    data={transactions} 
                    filterKey="payee"
                    onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        deleteTransactions.mutate({ids});
                    }}
                    disabled={isDisabled}
                />
            </CardContent>
        </Card>
    </div>
  );
};

export default TransactionsPage;
