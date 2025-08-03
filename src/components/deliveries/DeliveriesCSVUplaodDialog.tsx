import { useDeliveryImport } from "@/api/delivery.api";
import { closeAlertDialog } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormField } from "../ui/form";
import { m } from "@/paraglide/messages";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type DeliveriesCSVUplaodDialogProps = {
    children: React.ReactNode;
};

function DeliveriesCSVUplaodDialog({
    children,
}: DeliveriesCSVUplaodDialogProps) {
    const importFrpmCSV = useDeliveryImport();

    const form = useForm<DeliveryCSVUplaodType>({
        resolver: zodResolver(fileSchema),
    });

    function handleSubmit(data: DeliveryCSVUplaodType) {
        importFrpmCSV.mutate(data.file, {
            onSuccess: () => {
                form.reset();
                closeAlertDialog();
            },
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-5xl w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["deliveries.upload delivery CSV"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            field.onChange(e.target.files[0]);
                                        } else {
                                            field.onChange(null);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button type="submit" className="mt-4">
                            {m["common.upload"]() + "CSV"}
                        </Button>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeliveriesCSVUplaodDialog;

const fileSchema = z.object({
    file: z.instanceof(File).refine((file) => file.type === "text/csv", {
        message: "File must be a CSV",
    }),
});

export type DeliveryCSVUplaodType = z.infer<typeof fileSchema>;
