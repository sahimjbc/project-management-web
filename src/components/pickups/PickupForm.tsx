import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";
import { z } from "zod/v4";
import { closeAlertDialog, phoneNumberRegex } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCustomerOptions } from "@/api/customer.api";
import { Button } from "@/components/ui/button";
import { useCreatePickup, useUpdatePickup } from "@/api/pickup.api";
import type { Pickup } from "@/api/pickup.type";

function PickupForm({
    pickup,
    children,
}: {
    pickup?: Pickup;
    children?: React.ReactNode;
}) {
    const form = useForm<PickupFormValues, unknown, PickupFormType>({
        resolver: zodResolver(pickupFormSchema),
        defaultValues: {
            customer_id: pickup?.customer.id || "",
            pickup_address_name: pickup?.pickup_address_name || "",
            pickup_address: pickup?.pickup_address || "",
            pickup_phone_number: pickup?.pickup_phone_number || "",
        },
    });

    const { data: customers } = useQuery(getCustomerOptions());
    const createPickup = useCreatePickup();
    const updatePickup = useUpdatePickup();

    function handleSubmit(data: PickupFormType) {
        if (pickup) {
            updatePickup.mutate(
                { ...data, id: pickup.id },
                {
                    onSuccess() {
                        form.reset({
                            customer_id: data.customer_id,
                            pickup_address_name: data.pickup_address_name,
                            pickup_address: data.pickup_address,
                            pickup_phone_number: data.pickup_phone_number,
                        });
                        closeAlertDialog();
                    },
                }
            );
        } else {
            createPickup.mutate(data, {
                onSuccess() {
                    form.reset();
                    closeAlertDialog();
                },
            });
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-3xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["customers.edit customer information"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <Table>
                            <TableBody className="[&>tr>td:first-child]:bg-pink text-center font-semibold">
                                <FormField
                                    control={form.control}
                                    name="customer_id"
                                    render={({ field }) => (
                                        <TableRow>
                                            <TableCell>
                                                {m["pickups.customer id"]()}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={String(
                                                        field.value as string
                                                    )}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={
                                                                pickup
                                                                    ? pickup
                                                                          .customer
                                                                          .customer_name
                                                                    : m[
                                                                          "pickups.customer name"
                                                                      ]()
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {customers?.map(
                                                            (customer) => (
                                                                <SelectItem
                                                                    key={
                                                                        customer.id
                                                                    }
                                                                    value={customer.id.toString()}
                                                                >
                                                                    {
                                                                        customer.customer_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pickup_address_name"
                                    render={({ field }) => (
                                        <TableRow>
                                            <TableCell>
                                                {m["pickups.pickup address"]()}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder={m[
                                                        "pickups.pickup address"
                                                    ]()}
                                                    {...field}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pickup_address"
                                    render={({ field }) => (
                                        <TableRow>
                                            <TableCell>
                                                {m["pickups.address"]()}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder={m[
                                                        "pickups.address"
                                                    ]()}
                                                    {...field}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pickup_phone_number"
                                    render={({ field }) => (
                                        <TableRow>
                                            <TableCell>
                                                {m["common.phone number"]()}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    placeholder={"000-000-0000"}
                                                    {...field}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TableBody>
                        </Table>

                        <AlertDialogFooter className="mt-4">
                            <Button> {m["common.confirm"]()}</Button>
                            <AlertDialogCancel
                                type="button"
                                onClick={() => form.reset()}
                            >
                                {m["common.close"]()}
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default PickupForm;

const pickupFormSchema = z.object({
    customer_id: z.coerce.number().int().min(1, "Customer ID is required"),
    pickup_address_name: z.string().min(1, "Pickup address is required"),
    pickup_address: z.string().min(1, "Address is required"),
    pickup_phone_number: z
        .string()
        .min(1, "Phone number is required")
        .regex(phoneNumberRegex, "Invalid phone number format"),
});

export type PickupFormType = z.output<typeof pickupFormSchema>;
type PickupFormValues = z.input<typeof pickupFormSchema>;
