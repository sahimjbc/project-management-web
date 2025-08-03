import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod/v4";
import { getCustomerOptions } from "@/api/customer.api";
import { Button } from "@/components/ui/button";
import {
    useCreateUser,
    useUpdateUser,
    type CreateUserPaylaod,
    type UpdateUserPayload,
    type User,
} from "@/api/user.api";
import { navLinks } from "@/lib/links";
import { closeAlertDialog } from "@/lib/utils";

function UserForm({
    user,
    children,
}: {
    user?: User;
    children?: React.ReactNode;
}) {
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const schema = user ? updateUserFormSchema : newUserFormSchema;

    type FormType = z.infer<typeof schema>;

    const form = useForm<FormType>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: user?.username || "",
            user_name: user?.user_name || "",
            password: "",
            roles: user?.roles || ["admin"],
            shipping_menu:
                user?.permissions.includes("shipping_input") || false,
            collection:
                user?.permissions.includes("collection_center_qr") || false,
            collection_center:
                user?.permissions.includes("sorting_qr") || false,
            distribution_center:
                user?.permissions.includes("arrival_qr") || false,
            master_maintenance:
                user?.permissions.includes("master_maintenance") || false,
            customer_id: user?.customer?.id ? String(user.customer.id) : "",
        },
    });

    const {
        data: customers,
        // isLoading: isCustomersLoading,
        // isError: isCustomersError,
        // error: customersError,
    } = useQuery(getCustomerOptions());

    const selectedRole = form.watch("roles")?.[0];

    function updateRole(role: UserRole) {
        if (role === "admin") {
            form.setValue("customer_id", "", {
                shouldValidate: true,
            });
            form.clearErrors("customer_id");
            form.clearErrors("roles");
            form.resetField("customer_id");
        } else {
            form.setValue("shipping_menu", true);
            form.setValue("collection", false);
            form.setValue("collection_center", false);
            form.setValue("distribution_center", false);
            form.setValue("master_maintenance", false);
        }

        form.setValue("roles", [role], {
            shouldValidate: true,
        });
    }

    function handleSubmit(data: FormType) {
        const permissions = navLinks
            .filter((group) => data[group.key as keyof typeof user] === true)
            .flatMap((group) => group.links.map((link) => link.id));

        const payload: Record<string, unknown> = {
            username: data.username,
            user_name: data.user_name,
            roles: data.roles,
            ...(data.customer_id && {
                customer_id: data.customer_id,
            }),
            permissions: permissions,
            user_id: user?.user_id,
        };

        if ("password" in data && data.password) {
            payload.password = data.password;
        }

        if (user) {
            updateUser.mutate(payload as UpdateUserPayload, {
                onSuccess: () => {
                    form.reset();
                    closeAlertDialog();
                },
            });
        } else {
            createUser.mutate(
                payload as CreateUserPaylaod & {
                    password: string;
                },
                {
                    onSuccess: () => {
                        form.reset();
                        closeAlertDialog();
                    },
                }
            );
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["users.edit user information"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <table className="border-collapse border border-black w-full [&_td]:border [&_td]:border-black [&_td]:p-2 [&_tr>td:first-child]:bg-pink-100">
                            <tbody>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel
                                                    className="gap-0"
                                                    htmlFor="username"
                                                >
                                                    {m["users.user CD"]()}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        id="username"
                                                        placeholder={m[
                                                            "users.user code placeholder"
                                                        ]()}
                                                        aria-disabled={!!user}
                                                        disabled={!!user}
                                                        error={
                                                            form.formState
                                                                .errors
                                                                .username !=
                                                            null
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="user_name"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel
                                                    className="gap-0"
                                                    htmlFor="user_name"
                                                >
                                                    {m["users.username"]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        id="user_name"
                                                        placeholder={m[
                                                            "users.username placeholder"
                                                        ]()}
                                                        error={
                                                            form.formState
                                                                .errors
                                                                .user_name !=
                                                            null
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <tr>
                                            <td className="!bg-accent">
                                                <FormLabel className="gap-0">
                                                    {m["users.password"]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        error={
                                                            form.formState
                                                                .errors
                                                                .password !=
                                                            null
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {m[
                                                        "users.password description"
                                                    ]()}
                                                </FormDescription>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <tr>
                                    <td>
                                        <FormLabel
                                            className="gap-0"
                                            data-error={
                                                form.watch("roles")[0] ===
                                                    "customer" &&
                                                form.watch("customer_id") === ""
                                            }
                                        >
                                            {m["users.role"]()}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FormLabel>
                                    </td>
                                    <td>
                                        <div>
                                            <RadioGroup
                                                className="flex items-center gap-x-4"
                                                onValueChange={updateRole}
                                                value={
                                                    form.getValues("roles")[0]
                                                }
                                            >
                                                <div className="flex items-center gap-x-2 ">
                                                    <RadioGroupItem
                                                        id="admin"
                                                        value="admin"
                                                    />
                                                    <FormLabel htmlFor="admin">
                                                        {m["users.admin"]()}
                                                    </FormLabel>
                                                </div>

                                                <div className="flex items-center gap-x-2">
                                                    <RadioGroupItem
                                                        id="customer"
                                                        value="customer"
                                                    />
                                                    <FormLabel htmlFor="customer">
                                                        {m["users.customer"]()}
                                                    </FormLabel>
                                                </div>
                                            </RadioGroup>

                                            <Select
                                                onValueChange={(value) =>
                                                    form.setValue(
                                                        "customer_id",
                                                        value
                                                    )
                                                }
                                                // value={form.getValues(
                                                //     "customer_id"
                                                // )}
                                                defaultValue={
                                                    user?.customer?.id
                                                        ? String(
                                                              user.customer.id
                                                          )
                                                        : ""
                                                }
                                                disabled={
                                                    selectedRole !== "customer"
                                                }
                                            >
                                                <SelectTrigger
                                                    className="w-full mt-2"
                                                    aria-invalid={
                                                        form.watch(
                                                            "roles"
                                                        )[0] === "customer" &&
                                                        form.watch(
                                                            "customer_id"
                                                        ) === ""
                                                    }
                                                >
                                                    <SelectValue
                                                        placeholder={
                                                            customers && user
                                                                ? customers.find(
                                                                      (c) =>
                                                                          c.id ===
                                                                          user
                                                                              .customer
                                                                              ?.id
                                                                  )
                                                                      ?.customer_code ||
                                                                  ""
                                                                : ""
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers &&
                                                        customers.map(
                                                            (customer) => (
                                                                <SelectItem
                                                                    key={
                                                                        customer.id
                                                                    }
                                                                    value={String(
                                                                        customer.id
                                                                    )}
                                                                >
                                                                    {
                                                                        customer.customer_code
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        customer.customer_name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </td>
                                </tr>

                                <FormField
                                    control={form.control}
                                    name="shipping_menu"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel className="gap-0">
                                                    {m[
                                                        "users.shipping input"
                                                    ]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <RadioGroup
                                                        className="flex items-center gap-x-4"
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            field.onChange(
                                                                value ===
                                                                    "shipping_menu"
                                                            )
                                                        }
                                                        value={
                                                            field.value
                                                                ? "shipping_menu"
                                                                : ""
                                                        }
                                                        disabled={
                                                            selectedRole ===
                                                            "customer"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <RadioGroupItem
                                                                id="shipping_input.not-authorized"
                                                                value=""
                                                            />
                                                            <FormLabel
                                                                htmlFor="shipping_input.not-authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.not authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>

                                                        <div className="flex items-center gap-x-2 ">
                                                            <RadioGroupItem
                                                                id="shipping_input.authorized"
                                                                value="shipping_menu"
                                                            />
                                                            <FormLabel
                                                                htmlFor="shipping_input.authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="collection"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel className="gap-0">
                                                    {m["users.collection"]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <RadioGroup
                                                        className="flex items-center gap-x-4"
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            field.onChange(
                                                                value ===
                                                                    "collection"
                                                            );
                                                        }}
                                                        value={
                                                            field.value
                                                                ? "collection"
                                                                : ""
                                                        }
                                                        disabled={
                                                            selectedRole ===
                                                            "customer"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <RadioGroupItem
                                                                id="collection.not-authorized"
                                                                value=""
                                                            />
                                                            <FormLabel
                                                                htmlFor="collection.not-authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.not authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>

                                                        <div className="flex items-center gap-x-2 ">
                                                            <RadioGroupItem
                                                                id="collection.authorized"
                                                                value="collection"
                                                            />
                                                            <FormLabel
                                                                htmlFor="collection.authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="collection_center"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel className="gap-0">
                                                    {m[
                                                        "users.collection Center"
                                                    ]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <RadioGroup
                                                        className="flex items-center gap-x-4"
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            field.onChange(
                                                                value ===
                                                                    "collection_center"
                                                            );
                                                        }}
                                                        value={
                                                            field.value
                                                                ? "collection_center"
                                                                : ""
                                                        }
                                                        disabled={
                                                            selectedRole ===
                                                            "customer"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <RadioGroupItem
                                                                id="collection-center.not-authorized"
                                                                value=""
                                                            />
                                                            <FormLabel
                                                                htmlFor="collection-center.not-authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.not authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>

                                                        <div className="flex items-center gap-x-2 ">
                                                            <RadioGroupItem
                                                                id="collection-center.authorized"
                                                                value="collection_center"
                                                            />
                                                            <FormLabel
                                                                htmlFor="collection-center.authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="distribution_center"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel className="gap-0">
                                                    {m[
                                                        "users.distribution center"
                                                    ]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <RadioGroup
                                                        className="flex items-center gap-x-4"
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            field.onChange(
                                                                value ===
                                                                    "distribution_center"
                                                            );
                                                        }}
                                                        value={
                                                            field.value
                                                                ? "distribution_center"
                                                                : ""
                                                        }
                                                        disabled={
                                                            selectedRole ===
                                                            "customer"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <RadioGroupItem
                                                                id="distribution-center.not-authorized"
                                                                value=""
                                                            />
                                                            <FormLabel
                                                                htmlFor="distribution-center.not-authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.not authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>

                                                        <div className="flex items-center gap-x-2 ">
                                                            <RadioGroupItem
                                                                id="distribution-center.authorized"
                                                                value="distribution_center"
                                                            />
                                                            <FormLabel
                                                                htmlFor="distribution-center.authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.authorized"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                            </td>
                                        </tr>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="master_maintenance"
                                    render={({ field }) => (
                                        <tr>
                                            <td>
                                                <FormLabel className="gap-0">
                                                    {m[
                                                        "users.administration"
                                                    ]()}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </FormLabel>
                                            </td>
                                            <td>
                                                <FormControl>
                                                    <RadioGroup
                                                        className="flex items-center gap-x-4"
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            field.onChange(
                                                                value ===
                                                                    "master_maintenance"
                                                            );
                                                        }}
                                                        value={
                                                            field.value
                                                                ? "master_maintenance"
                                                                : ""
                                                        }
                                                        disabled={
                                                            selectedRole ===
                                                            "customer"
                                                        }
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <RadioGroupItem
                                                                id="master_maintenance.not-authorized"
                                                                value=""
                                                            />
                                                            <FormLabel
                                                                htmlFor="master_maintenance.not-authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.non-admin"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>

                                                        <div className="flex items-center gap-x-2 ">
                                                            <RadioGroupItem
                                                                id="master_maintenance.authorized"
                                                                value="master_maintenance"
                                                            />
                                                            <FormLabel
                                                                htmlFor="master_maintenance.authorized"
                                                                aria-disabled={
                                                                    selectedRole ===
                                                                    "customer"
                                                                }
                                                            >
                                                                {m[
                                                                    "users.master-admin"
                                                                ]()}
                                                            </FormLabel>
                                                        </div>
                                                    </RadioGroup>
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
                                <Button variant={"outline"}>
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

export default UserForm;

const baseUserSchema = z
    .object({
        username: z.string().trim().length(6, "Must be exactly 6 chars"),
        user_name: z.string().trim().min(1, "Name is required"),
        roles: z
            .array(z.enum(["super_admin", "admin", "customer"]))
            .min(1, "Select at least one role"),
        shipping_menu: z.boolean(),
        collection: z.boolean(),
        collection_center: z.boolean(),
        distribution_center: z.boolean(),
        master_maintenance: z.boolean(),
        customer_id: z.string().optional(),
    })
    .refine((data) => !(data.roles.includes("customer") && !data.customer_id), {
        path: ["customer_id"],
        message: "Customer ID is required when role is customer",
    });

const newUserFormSchema = baseUserSchema.extend({
    password: z.string().trim().min(4, "Password must be at least 4 chars"),
});

const updateUserFormSchema = baseUserSchema.extend({
    password: z
        .string()
        .trim()
        .min(4, "Password must be at least 4 chars")
        .or(z.literal(""))
        .optional(),
});
