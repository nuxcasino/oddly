import { z } from "zod";
import { Loader2 } from "lucide-react";

import { insertAccountSchema } from "@/db/schema";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { AccountForm } from "@/features/accounts/components/account-form";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useEditAcount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAcount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";


const formScheam = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formScheam>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id} = useOpenAccount();
    
    const [ConfirmaDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this account"
    )

    const accountQuery = useGetAccount(id);
    const eddiMutation = useEditAcount(id);
    const deleteMutation = useDeleteAcount(id);

    const isPending = eddiMutation.isPending || deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        eddiMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();
        if(ok){
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
                onClose();
            }
          });
        }
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    }

    return(
        <>
            <ConfirmaDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>Edit Account</SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />                        
                        </div>) :(
                        <AccountForm 
                            id= {id}
                            onSubmit={onSubmit} 
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                        />)
                    }
                </SheetContent>
            </Sheet>
        </>
    )
}