import { m } from "@/paraglide/messages";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { distributionPickupSearchOption } from "@/api/distribution.api";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { closeAlertDialog, phoneNumberRegex } from "@/lib/utils";
import { useAtom } from "jotai/react";
import { authAtom } from "@/store";

type Props = {
    children: React.ReactNode;
    onSelect: (location: DistributionPickupSearchOptionParams) => void;
};

function PickupLocationSearch({ onSelect, children }: Props) {
    const [queryFilters, setQueryFilters] =
        useState<DistributionPickupSearchOptionParams>({});

    const auth = useAtom(authAtom)[0];

    const { data: pickupLocations } = useQuery(
        distributionPickupSearchOption(queryFilters)
    );

    const form = useForm<
        DistributionPickupSearchOptionParamsInput,
        unknown,
        DistributionPickupSearchOptionParams
    >({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            address: "",
            address_name: "",
            phone_number: "",
        },
    });

    function handleFilterChange(params: DistributionPickupSearchOptionParams) {
        setQueryFilters({
            ...(params.address && { address: params.address.trim() }),
            ...(params.address_name && { address_name: params.address_name }),
            ...(params.phone_number && { phone_number: params.phone_number }),
        });
    }

    function handleSelectLocation(
        location: DistributionPickupSearchOptionParams
    ) {
        if (onSelect) {
            onSelect(location);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-5xl w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["shipping input.pickup localtion search"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <form
                    className="grid grid-cols-[6rem_auto] gap-4"
                    onSubmit={form.handleSubmit(handleFilterChange)}
                >
                    <div className="flex gap-8 col-span-2">
                        <div className="flex gap-2 ">
                            <Label htmlFor="address_name" className="shrink-0">
                                {m[
                                    "shipping input.Pickup Location Name (Partial Search)"
                                ]()}
                            </Label>
                            <Input
                                type="text"
                                id="address_name"
                                {...form.register("address_name")}
                            />
                        </div>

                        <div className="flex gap-2 ">
                            <Label htmlFor="address">
                                {m["common.address"]()}
                            </Label>
                            <Input
                                type="text"
                                id="address"
                                {...form.register("address")}
                            />
                        </div>
                    </div>

                    <Label htmlFor="phone">{m["common.phone"]()}</Label>
                    <Input
                        type="number"
                        id="phone"
                        className="max-w-xs"
                        {...form.register("phone_number")}
                    />
                    <div className="col-span-2 space-x-2">
                        <Button type="submit" variant={"basic"}>
                            {m["common.filter"]()}
                        </Button>
                        <Button
                            type="reset"
                            variant={"basic"}
                            onClick={() => {
                                form.reset();
                                setQueryFilters({});
                            }}
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
                            {!auth?.user.customer_id && (
                                <TableHead>
                                    {m["customers.customer name.label"]()}
                                </TableHead>
                            )}
                            <TableHead>
                                {m["shipping input.pickup location name"]()}
                            </TableHead>
                            <TableHead>{m["common.address"]()}</TableHead>
                            <TableHead>{m["common.phone"]()}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pickupLocations &&
                            pickupLocations.map((location) => (
                                <TableRow key={location.id}>
                                    <TableCell>
                                        <Button
                                            variant={"basic"}
                                            type="button"
                                            onClick={() => {
                                                handleSelectLocation({
                                                    address:
                                                        location.pickup_address,
                                                    address_name:
                                                        location.pickup_address_name,
                                                    phone_number:
                                                        location.pickup_phone_number,
                                                });
                                                closeAlertDialog();
                                            }}
                                        >
                                            {m["common.select"]()}
                                        </Button>
                                    </TableCell>
                                    {!auth?.user.customer_id && (
                                        <TableCell>
                                            {location.customer_name}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        {location.pickup_address_name}
                                    </TableCell>
                                    <TableCell>
                                        {location.pickup_address}
                                    </TableCell>
                                    <TableCell>
                                        {location.pickup_phone_number}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default PickupLocationSearch;

const filterSchema = z.object({
    address: z.string().optional(),
    address_name: z.string().optional(),
    phone_number: z
        .string()
        .regex(phoneNumberRegex, {
            message: "Invalid phone number format",
        })
        .optional(),
});

export type DistributionPickupSearchOptionParams = z.output<
    typeof filterSchema
>;
type DistributionPickupSearchOptionParamsInput = z.input<typeof filterSchema>;
