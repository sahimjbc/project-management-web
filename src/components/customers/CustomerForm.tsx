import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { closeAlertDialog, cn } from "@/lib/utils";
import { useCreateCustomer, useUpdateCustomer } from "@/api/customer.api";
import type { Customer } from "@/api/customer.type";
import { useQuery } from "@tanstack/react-query";
import { getZipSearchData } from "@/api/zipsearch.api";

function CustomerForm({
    customer,
    children,
}: {
    customer?: Customer;
    children?: React.ReactNode;
}) {
    const createCustomer = useCreateCustomer();
    const updateCustomer = useUpdateCustomer();

    const form = useForm<CustomerFormType>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            customer_code: customer?.customer_code || "",
            customer_name: customer?.customer_name || "",
            customer_department_name: customer?.customer_department_name || "",
            customer_contact_name: customer?.customer_contact_name || "",
            customer_post_code: customer?.customer_post_code || "",
            customer_prefecures: customer?.customer_prefecures || "",
            customer_address_1: customer?.customer_address_1 || "",
            customer_address_2: customer?.customer_address_2,
            customer_phone_number: customer?.customer_phone_number || "",
            customer_email: customer?.customer_email,
        },
    });

    const { refetch } = useQuery(
        getZipSearchData({ zip_cd: form.watch("customer_post_code") })
    );

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["customers.edit customer information"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => {
                            if (customer) {
                                updateCustomer.mutate(
                                    { ...data, id: customer.id },
                                    {
                                        onSuccess: () => {
                                            form.reset();
                                            closeAlertDialog();
                                        },
                                    }
                                );
                            } else {
                                createCustomer.mutate(data, {
                                    onSuccess: () => {
                                        form.reset();
                                        closeAlertDialog();
                                    },
                                });
                            }
                        })}
                    >
                        <table className="border-collapse border border-black w-full [&_td]:border [&_td]:border-black [&_td]:p-2 [&_tr>td:first-child]:bg-pink-100">
                            <tbody>
                                <FormField
                                    control={form.control}
                                    name="customer_code"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.customer code.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        disabled={!!customer}
                                                        placeholder={m[
                                                            "customers.customer code.placeholder"
                                                        ]()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_name"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.customer name.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        placeholder={m[
                                                            "customers.customer name.placeholder"
                                                        ]()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_department_name"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.department.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        placeholder={m[
                                                            "customers.department.placeholder"
                                                        ]()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_contact_name"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.customer contact name.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        placeholder={m[
                                                            "customers.customer contact name.placeholder"
                                                        ]()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_post_code"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.post code.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input
                                                            placeholder={m[
                                                                "customers.post code.placeholder"
                                                            ]()}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        variant={"basic"}
                                                        type="button"
                                                        onClick={async () => {
                                                            const result =
                                                                await refetch();
                                                            const zip =
                                                                result.data;

                                                            if (zip) {
                                                                form.setValue(
                                                                    "customer_prefecures",
                                                                    zip.address
                                                                        .prefecture ||
                                                                        ""
                                                                );
                                                                form.setValue(
                                                                    "customer_address_1",
                                                                    zip.address
                                                                        .address1 ||
                                                                        ""
                                                                );
                                                                form.setValue(
                                                                    "customer_address_2",
                                                                    zip.address
                                                                        .address2 ||
                                                                        ""
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {m[
                                                            "customers.search address"
                                                        ]()}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <tr>
                                    <td>
                                        <FormLabel
                                            className={cn(
                                                form.formState.errors
                                                    .customer_prefecures
                                                    ? "text-destructive"
                                                    : ""
                                            )}
                                        >
                                            {m["customers.address.label"]()}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </FormLabel>
                                    </td>
                                    <td className="space-y-2">
                                        <Input
                                            placeholder={m[
                                                "common.please enter prefecture"
                                            ]()}
                                            {...form.register(
                                                "customer_prefecures"
                                            )}
                                            error={
                                                !!form.formState.errors
                                                    .customer_prefecures
                                            }
                                        />
                                        <Input
                                            {...form.register(
                                                "customer_address_1"
                                            )}
                                            placeholder={
                                                m[
                                                    "common.please enter address"
                                                ]() + " 1"
                                            }
                                            error={
                                                !!form.formState.errors
                                                    .customer_address_1
                                            }
                                        />
                                        <Input
                                            {...form.register(
                                                "customer_address_2"
                                            )}
                                            placeholder={
                                                m[
                                                    "common.please enter address"
                                                ]() + " 2"
                                            }
                                            error={
                                                !!form.formState.errors
                                                    .customer_address_2
                                            }
                                        />
                                    </td>
                                </tr>

                                <FormField
                                    control={form.control}
                                    name="customer_phone_number"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.phone number.label"
                                                    ]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        placeholder={m[
                                                            "customers.phone number.placeholder"
                                                        ]()}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customer_email"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel>
                                                    {m[
                                                        "customers.email address"
                                                    ]()}
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />
                            </tbody>
                        </table>
                        <div className="flex items-center justify-end mt-4 gap-x-2">
                            <Button variant={"basic"} type="submit">
                                {m["common.confirm"]()}
                            </Button>

                            <AlertDialogCancel asChild>
                                <Button
                                    variant={"outline"}
                                    onClick={() => form.reset()}
                                >
                                    {m["common.close"]()}
                                </Button>
                            </AlertDialogCancel>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default CustomerForm;

const customerFormSchema = z.object({
    customer_name: z.string().trim().min(1),
    customer_code: z.string().trim().min(1),
    customer_department_name: z.string().trim().min(1),
    customer_contact_name: z.string().trim().min(1),
    customer_post_code: z.string().trim().min(1),
    customer_prefecures: z.string().trim().min(1),
    customer_address_1: z.string().trim().min(1),
    customer_address_2: z.string().trim().optional(),
    customer_phone_number: z.string().trim().min(1),
    customer_email: z.email().trim().optional(),
});

export type CustomerFormType = z.infer<typeof customerFormSchema>;
