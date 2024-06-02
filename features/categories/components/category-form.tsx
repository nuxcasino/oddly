import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { insertCategorySchema } from "@/db/schema";

const formScheam = insertCategorySchema.pick({
    name: true,
});

type FormValues = z.input<typeof formScheam>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled: boolean;
}

export const CategoryForm = ({
    id, 
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formScheam),
        defaultValues: defaultValues
    });

    const handleSubimt = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return(
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(handleSubimt)}
                className="space-y-4 pt-4"
            >
                <FormField 
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                    disabled={disabled}
                                    placeholder="e.g Food, Travel, etc."
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>                        
                    )}
                 />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save change" : "Create category"}
                </Button>
                {!!id && (
                    <Button 
                        type="button"
                        className="w-full"
                        variant={"outline"} 
                        onClick={handleDelete}
                        disabled={disabled}
                    >
                        <Trash className="size-4 m-8" />
                        Delete category
                    </Button>
                )}
            </form>
        </Form>
    );
}