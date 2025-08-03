import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { distributionDeliverySearchOption } from "@/api/distribution.api";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { DistributionDeliveryLocation } from "@/api/distribution.type";
import { closeAlertDialog } from "@/lib/utils";
import Loader from "../Loader";
import { useAtom } from "jotai/react";
import { authAtom } from "@/store";

type Props = {
    onSelect?: (
        delivery: Omit<DistributionDeliveryLocation, "id" | "customer_id">
    ) => void;
    children: React.ReactNode;
};

function SearchDeliveryAddressDialog({ onSelect, children }: Props) {
    const [queryFilter, setQueryFilter] =
        useState<SearchDeliveryAddressQueryParams>({});

    const { data: deliveries, isFetching } = useQuery(
        distributionDeliverySearchOption(queryFilter)
    );

    const form = useForm<SearchDeliveryAddressQueryParams>({
        resolver: zodResolver(searchDeliveryAddressQueryParamsSchema),
        defaultValues: {
            address: "",
            address_name: "",
            phone_number: "",
        },
    });

    const user = useAtom(authAtom)[0];

    function handleFilterChange(params: SearchDeliveryAddressQueryParams) {
        setQueryFilter({
            ...(params.address && { address: params.address.trim() }),
            ...(params.address_name && {
                address_name: params.address_name.trim(),
            }),
            ...(params.phone_number && {
                phone_number: params.phone_number.trim(),
            }),
        });
    }

    function handleSelect(delivery: DistributionDeliveryLocation) {
        if (onSelect) {
            onSelect(delivery);
            closeAlertDialog();
        }
    }

    function handleClear() {
        form.reset();
        setQueryFilter({});
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-5xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["shipping input.search delivery location.title"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(handleFilterChange)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                <Label htmlFor="address_name">
                                    {m[
                                        "shipping input.search delivery location.delivery location name (Partial Search)"
                                    ]()}
                                </Label>
                                <Input
                                    type="text"
                                    id="address_name"
                                    placeholder={m["common.search"]()}
                                    className="max-w-xs"
                                    {...form.register("address_name")}
                                />
                            </div>

                            <div className="flex gap-1">
                                <Label htmlFor="address">
                                    {m["common.address"]()}
                                </Label>
                                <Input
                                    type="text"
                                    id="address"
                                    placeholder={m["common.address"]()}
                                    className="max-w-xs"
                                    {...form.register("address")}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Label htmlFor="phone_number">
                                {m["common.phone"]()}
                            </Label>
                            <Input
                                type="text"
                                id="phone_number"
                                placeholder={m["common.phone"]()}
                                className="max-w-xs"
                                {...form.register("phone_number")}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" variant="basic">
                                {m["common.filter"]()}
                            </Button>
                            <Button
                                type="reset"
                                variant="basic"
                                className="ml-2"
                                onClick={handleClear}
                            >
                                {m["common.clear"]()}
                            </Button>
                        </div>
                    </form>

                    <Table className="text-center">
                        <TableHeader>
                            <TableRow className="[&_th]:bg-pink">
                                <TableHead className="w-[2rem]">
                                    {m["common.select"]()}
                                </TableHead>
                                {!user?.user.customer_id && (
                                    <TableHead>
                                        {m["customers.customer name.label"]()}
                                    </TableHead>
                                )}
                                <TableHead>
                                    {m[
                                        "shipping input.search delivery location.shipping address"
                                    ]()}
                                </TableHead>
                                <TableHead>{m["common.address"]()}</TableHead>
                                <TableHead>{m["common.phone"]()}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        <Loader />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                deliveries &&
                                deliveries.map((delivery) => (
                                    <TableRow key={delivery.id}>
                                        <TableCell className="w-[2rem]">
                                            <Button
                                                variant="basic"
                                                onClick={() => {
                                                    handleSelect(delivery);
                                                }}
                                            >
                                                {m["common.select"]()}
                                            </Button>
                                        </TableCell>
                                        {!user?.user.customer_id && (
                                            <TableCell>
                                                {delivery.customer_name}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {delivery.delivery_address_name}
                                        </TableCell>
                                        <TableCell>
                                            {`${delivery.delivery_prefecture}${delivery.delivery_address_1}${delivery.delivery_address_2}`}
                                        </TableCell>
                                        <TableCell>
                                            {delivery.delivery_phone_number}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default SearchDeliveryAddressDialog;

const searchDeliveryAddressQueryParamsSchema = z.object({
    address: z.string().optional(),
    address_name: z.string().optional(),
    phone_number: z.string().optional(),
});

export type SearchDeliveryAddressQueryParams = z.infer<
    typeof searchDeliveryAddressQueryParamsSchema
>;
