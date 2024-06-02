import { useState } from "react";
import { format, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportTable } from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";


const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [ "amount","date","payee"];

interface SelectedColumnsState{
    [key: string]: string | null;
};

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data:any) => void;
};

export const ImportCard = ({data,onCancel,onSubmit}:Props) => {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});
    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange =(columnIndex: number, value: string | null) => {
        setSelectedColumns((prev) => {
            const newSelectColumns = {...prev};

            for(const key in newSelectColumns) {
                if(newSelectColumns[key] === value){
                    newSelectColumns[key] = null;
                }
            }
            if(value === "Skip"){
                value = null;
            }
            newSelectColumns[`column_${columnIndex}`] = value;
            return newSelectColumns;
        });
    };

    const progress = Object.values(selectedColumns).filter(value => requiredOptions.includes(value!)).length;

    const isDisabled = (): boolean => {
        return !requiredOptions.every(option => 
            Object.values(selectedColumns).includes(option)
        );
    };

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        };
        const mappedDate = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`); 
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });

                return transformRow.every((item) => item === null) ? [] : transformRow;
            }).filter((row) => row.length > 0),
        };
        

        const arrayOfData = mappedDate.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedDate.headers[index];
                if(header !== null) {
                    acc[header] = cell;
                }
                return acc;
            }, {});
        })

        const formattedData = arrayOfData.map((item) => ({
            ...item,
            amount: convertAmountToMiliunits(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormat)
        }));

        onSubmit(formattedData);
    };

    return(
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">Import Transaction</CardTitle>

                <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                    <Button 
                        size={"sm"} 
                        onClick={onCancel}
                        className="w-full lg:w-auto"
                    >
                        Cancel
                    </Button>
                   <Button
                        size={"sm"}
                        disabled={isDisabled()}
                        onClick={handleContinue}
                        className="w-full lg:w-auto"
                   >
                        Continue ({progress} / {requiredOptions.length})
                   </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ImportTable
                    headers={headers}
                    body={body}
                    selectedColumns={selectedColumns}
                    onTableHeadSelectChange={onTableHeadSelectChange}
                />
            </CardContent>
        </Card>
    </div>
    );
};