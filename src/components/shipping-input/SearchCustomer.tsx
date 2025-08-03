import { useQuery } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getSearchCustomerOptions } from "@/api/customer.api";
import { Button } from "../ui/button";
import { m } from "@/paraglide/messages";
import type { Customer } from "@/api/customer.type";
import { closeAlertDialog } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel } from "../ui/form";
import removeFalsyKeys from "@/lib/remove-falsy-keys";
import Loader from "@/components/Loader";

type Props = {
    onSelect: (customer: Customer) => void;
    children?: React.ReactNode;
};

function SearchCustomer({ onSelect, children }: Props) {
    const [query, setQuery] = useState<CustomerParams>({
        customer_id: undefined,
        customer_name: "",
    });

    const form = useForm<CustomerParamsInput, unknown, CustomerParams>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            customer_id: "",
            customer_name: "",
        },
    });

    const { data: customers, isFetching } = useQuery(
        getSearchCustomerOptions(removeFalsyKeys(query))
    );

    function handleReset(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        form.reset();
        setQuery({ customer_id: undefined, customer_name: "" });
    }

    function handleSelect(customer: Customer) {
        onSelect(customer);
        form.reset();
        setQuery({ customer_id: undefined, customer_name: "" });
        closeAlertDialog();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children || "Search Customer"}
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-3xl text-center">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["shipping input.search customer"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            return form.handleSubmit(setQuery)(e);
                        }}
                    >
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="customer_id"
                                render={({ field }) => (
                                    <div className="space-y-2 w-full">
                                        <FormLabel
                                            className="text-left"
                                            htmlFor="customer-id"
                                        >
                                            {m["customers.customer id.label"]()}
                                        </FormLabel>

                                        <Input
                                            type="number"
                                            id="customer-id"
                                            placeholder={m[
                                                "customers.customer id.search placeholder"
                                            ]()}
                                            {...field}
                                            value={String(field.value || "")}
                                        />
                                    </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customer_name"
                                render={({ field }) => (
                                    <div className="space-y-2 w-full">
                                        <FormLabel
                                            className="text-left"
                                            htmlFor="customer-name"
                                        >
                                            {m[
                                                "customers.customer name.label"
                                            ]()}
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            id="customer-name"
                                            placeholder={m[
                                                "customers.customer name.search placeholder"
                                            ]()}
                                            {...field}
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="basic" className="">
                                {m["common.filter"]()}
                            </Button>

                            <Button
                                type="reset"
                                variant="basic"
                                className=""
                                onClick={handleReset}
                            >
                                {m["common.clear"]()}
                            </Button>
                        </div>
                    </form>
                </Form>

                <Table>
                    <TableHeader>
                        <TableRow className="[&_th]:bg-pink">
                            <TableHead></TableHead>
                            <TableHead>
                                {m["customers.customer id.label"]()}
                            </TableHead>
                            <TableHead>
                                {m["customers.customer code.label"]()}
                            </TableHead>
                            <TableHead>
                                {m["customers.customer name.label"]()}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : customers && customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    {m["common.no data available"]()}
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers &&
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <Button
                                            variant={"basic"}
                                            onClick={() =>
                                                handleSelect(customer)
                                            }
                                        >
                                            {m["common.select"]()}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{customer.id}</TableCell>
                                    <TableCell>
                                        {customer.customer_code}
                                    </TableCell>
                                    <TableCell>
                                        {customer.customer_name}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default SearchCustomer;

const filterSchema = z.object({
    customer_id: z.coerce
        .number()
        .transform((value) => (value === 0 ? undefined : value))
        .optional(),
    customer_name: z.string().optional(),
});
type CustomerParamsInput = z.input<typeof filterSchema>;
export type CustomerParams = z.output<typeof filterSchema>;
