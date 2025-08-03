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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCustomerOptions } from "@/api/customer.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateDelivery, useUpdateDelivery } from "@/api/delivery.api";
import type { Delivery } from "@/api/delivery.type";
import { getZipSearchData } from "@/api/zipsearch.api";

function DeliveryForm({
  delivery,
  children,
}: {
  delivery?: Delivery;
  children?: React.ReactNode;
}) {
  const { data: customers, isSuccess: isCustomersSuccess } =
    useQuery(getCustomerOptions());
  const createDeliveryEntry = useCreateDelivery();
  const updateDeliveryEntry = useUpdateDelivery();

  const form = useForm<DeliveryFormInputType, unknown, DeliveryFormType>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      customer_id: delivery?.customer_id || "",
      delivery_phone_number: delivery?.delivery_phone_number || "",
      delivery_address_name: delivery?.delivery_address_name || "",
      delivery_address_1: delivery?.delivery_address_1 || "",
      delivery_address_2: delivery?.delivery_address_2 || "",
      delivery_prefectures: delivery?.delivery_prefectures || "",
      delivery_post_code: delivery?.delivery_post_code || "",
    },
  });

  const { refetch } = useQuery(
    getZipSearchData({ zip_cd: form.watch("delivery_post_code") })
  );

  function handleSubmit(data: DeliveryFormType) {
    if (delivery) {
      updateDeliveryEntry.mutate(
        {
          id: delivery.id,
          ...data,
        },
        {
          onSuccess: () => {
            form.reset();
            closeAlertDialog();
          },
        }
      );
    } else {
      createDeliveryEntry.mutate(data, {
        onSuccess: () => {
          form.reset();
          closeAlertDialog();
        },
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-5xl">
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
                      <TableCell>{m["deliveries.customer id"]()}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={String(field.value)}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            const customer = customers?.find(
                              (customer) => customer.id === Number(value)
                            );
                            (
                              document.getElementById(
                                "customer_department_name"
                              ) as HTMLInputElement
                            ).value = customer?.customer_department_name || "";

                            (
                              document.getElementById(
                                "customer_contact_name"
                              ) as HTMLInputElement
                            ).value = customer?.customer_name || "";
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={m["common.select"]()} />
                          </SelectTrigger>
                          <SelectContent>
                            {isCustomersSuccess &&
                              customers?.map((customer) => (
                                <SelectItem
                                  key={customer.id}
                                  value={String(customer.id)}
                                >
                                  {customer.id} - {customer.customer_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_address_name"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>
                        {m["deliveries.shipping address"]()}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          {...field}
                          placeholder={m["deliveries.shipping address"]()}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />

                <TableRow>
                  <TableCell>
                    {m["deliveries.customer department name"]()}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      id="customer_department_name"
                      readOnly
                      className="w-full"
                      defaultValue={(() => {
                        const customer = customers?.find(
                          (c) => c.id === form.getValues("customer_id")
                        );
                        return customer?.customer_department_name || "";
                      })()}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    {m["deliveries.customer contact name"]()}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      id="customer_contact_name"
                      readOnly
                      className="w-full"
                      defaultValue={(() => {
                        const customer = customers?.find(
                          (c) => c.id === form.getValues("customer_id")
                        );
                        return customer?.customer_contact_name || "";
                      })()}
                    />
                  </TableCell>
                </TableRow>

                <FormField
                  control={form.control}
                  name="delivery_post_code"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>{m["deliveries.post code"]()}</TableCell>
                      <TableCell className="flex gap-2">
                        <Input
                          type="text"
                          {...field}
                          placeholder={"000-0000"}
                          className="w-full"
                        />
                        <Button
                          type="button"
                          onClick={async () => {
                            const result = await refetch();
                            const zip = result.data;

                            if (zip) {
                              form.setValue(
                                "delivery_prefectures",
                                zip.address.prefecture || ""
                              );
                              form.setValue(
                                "delivery_address_1",
                                zip.address.address1 || ""
                              );
                              form.setValue(
                                "delivery_address_2",
                                zip.address.address2 || ""
                              );
                            }
                          }}
                        >
                          {m["customers.search address"]()}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_prefectures"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>{m["deliveries.prefecture"]()}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          {...field}
                          placeholder={m["deliveries.prefecture"]()}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_address_1"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>{m["deliveries.address"]() + " 1"}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          {...field}
                          placeholder={m["deliveries.address"]()}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_address_2"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>{m["deliveries.address"]() + " 2"}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          {...field}
                          placeholder={m["deliveries.address"]() + " 2"}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_phone_number"
                  render={({ field }) => (
                    <TableRow>
                      <TableCell>{m["deliveries.telephone"]()}</TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          {...field}
                          placeholder={m["deliveries.telephone"]()}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TableBody>
            </Table>

            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel type="button">
                {m["common.close"]()}
              </AlertDialogCancel>

              <Button type="submit">{m["common.confirm"]()}</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeliveryForm;

const deliveryFormSchema = z.object({
  customer_id: z.coerce.number().int().positive(),
  delivery_phone_number: z
    .string()
    .trim()
    .max(20, "Phone number must be at most 20 characters long")
    .regex(phoneNumberRegex),
  delivery_address_name: z
    .string()
    .min(1, "Delivery address is required")
    .max(255, "Delivery address must be at most 255 characters long"),
  delivery_address_1: z.string().min(1, "Delivery address is required"),
  delivery_address_2: z
    .string()
    .max(255, "Delivery address must be at most 255 characters long")
    .optional(),
  delivery_prefectures: z
    .string()
    .min(1, "Prefecture is required")
    .max(50, "Prefecture must be at most 50 characters long"),
  delivery_post_code: z
    .string()
    .min(1, "Post code is required")
    .max(20, "Post code must be at most 20 characters long"),
});

export type DeliveryFormType = z.output<typeof deliveryFormSchema>;
export type DeliveryFormInputType = z.input<typeof deliveryFormSchema>;
