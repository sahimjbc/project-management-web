import { useState, type ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";
import { useQuery } from "@tanstack/react-query";
import { getSearchInvoiceOptions } from "@/api/distribution.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import type {
    DistributionItem,
    Invoice,
    OneOrTwo,
    SearchInvoiceFilters,
} from "@/api/distribution.type";
import type { ShippingInputFormType } from "@/routes/_authenticated/shipping-input";
import { closeAlertDialog } from "@/lib/utils";
import { format } from "date-fns";
import { useAtom } from "jotai/react";
import { authAtom } from "@/store";
import { InvoiceStatus } from "@/lib/statusList";

export type CopyType = Omit<
    ShippingInputFormType,
    "document_number" | "recept_date" | "pickup_date" | "delivery_date"
>;

type Props = {
    onEdit?: (data: ShippingInputFormType) => void;
    onCopy?: (data: CopyType) => void;
    children?: ReactNode;
};

function SearchInvoice({ onCopy, onEdit, children }: Props) {
    const [customerInput, setCustomerInput] = useState("");
    const [delivaryCategory, setDelivaryCategory] = useState<OneOrTwo[]>([
        1, 2,
    ]);
    const [dateOfReception, setDateOfReception] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        startDate: undefined,
        endDate: undefined,
    });
    const [preferredCollectionDate, setPreferredCollectionDate] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        startDate: undefined,
        endDate: undefined,
    });
    const [desiredDeliveryDate, setDesiredDeliveryDate] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        startDate: undefined,
        endDate: undefined,
    });

    const [searchQuery, setSearchQuery] = useState<SearchInvoiceFilters>({});

    const user = useAtom(authAtom)[0];

    const { data: invoices } = useQuery(getSearchInvoiceOptions(searchQuery));

    function handleSubmitFilters() {
        const query: SearchInvoiceFilters = {
            ...(customerInput && { customer_name: customerInput }),
            ...(delivaryCategory.length > 0 && { category: delivaryCategory }),
            ...(dateOfReception.startDate &&
                dateOfReception.endDate && {
                    recept_date_from: dateOfReception.startDate,
                    recept_date_to: dateOfReception.endDate,
                }),
            ...(preferredCollectionDate.startDate &&
                preferredCollectionDate.endDate && {
                    pickup_date_from: preferredCollectionDate.startDate,
                    pickup_date_to: preferredCollectionDate.endDate,
                }),
            ...(desiredDeliveryDate.startDate &&
                desiredDeliveryDate.endDate && {
                    delivery_date_from: desiredDeliveryDate.startDate,
                    delivery_date_to: desiredDeliveryDate.endDate,
                }),
        };
        setSearchQuery(query);
    }

    function handleClearFilters() {
        setCustomerInput("");
        setDelivaryCategory([]);
        setDateOfReception({ startDate: undefined, endDate: undefined });
        setPreferredCollectionDate({
            startDate: undefined,
            endDate: undefined,
        });
        setDesiredDeliveryDate({ startDate: undefined, endDate: undefined });
        setSearchQuery({});
    }

    function mapDistributionItems(items: DistributionItem[]) {
        return items.map((item) => ({
            id: item.id,
            item_size_id: item.size_id,
            item_weight_id: item.weight_id,
            item_count: item.item_number,
            status: item.status,
            distribution_item_document_number:
                item.distribution_item_document_number,
            amount: parseInt(item.amount, 10),
            print_status: item.print_status,
            size_id: item.size_id,
            weight_id: item.weight_id,
        }));
    }

    function handleEdit(invoice: Invoice) {
        if (onEdit) {
            onEdit({
                id: invoice.id,
                customer_name: invoice.customer.customer_name,
                customer_contact_name: invoice.customer_contact_name,
                customer_department_name: invoice.customer_department_name,
                customer_id: invoice.customer_id,
                delivery_address_1: invoice.delivery_address_1,
                delivery_address_2: invoice.delivery_address_2 || "",
                delivery_address_name: invoice.delivery_address_name,
                delivery_date: invoice.delivery_date as Date,
                delivery_location_id: invoice.delivery_location_id,
                delivery_phone_number: invoice.delivery_phone_number,
                delivery_post_code: invoice.delivery_post_code,
                delivery_prefecture: invoice.delivery_prefecture,
                distribution_items: mapDistributionItems(
                    invoice.distribution_items
                ),
                items: invoice.items,
                document_number: invoice.distribution_document_number,
                pickup_address: invoice.pickup_address,
                pickup_date: invoice.pickup_date as Date,
                pickup_location_id: invoice.pickup_location_id,
                pickup_phone_number: invoice.pickup_phone_number,
                pickup_address_name: invoice.pickup_address_name,
                print_status: invoice.print_status,
                product_name: invoice.product_name,
                recept_date: invoice.recept_date as Date,
                status: invoice.status,
                total_amount: invoice.total_amount,
            });
            closeAlertDialog();
        }
    }

    function handleCopy(invoice: Invoice) {
        if (onCopy) {
            onCopy({
                customer_name: invoice.customer.customer_name,
                customer_contact_name: invoice.customer_contact_name,
                customer_department_name: invoice.customer_department_name,
                customer_id: invoice.customer_id,
                delivery_address_1: invoice.delivery_address_1,
                delivery_address_2: invoice.delivery_address_2 || "",
                delivery_address_name: invoice.delivery_address_name,
                delivery_location_id: invoice.delivery_location_id,
                delivery_phone_number: invoice.delivery_phone_number,
                delivery_post_code: invoice.delivery_post_code,
                delivery_prefecture: invoice.delivery_prefecture,
                pickup_address: invoice.pickup_address,
                pickup_location_id: invoice.pickup_location_id,
                pickup_phone_number: invoice.pickup_phone_number,
                pickup_address_name: invoice.pickup_address_name,
                product_name: invoice.product_name,
                status: invoice.status,
                total_amount: invoice.total_amount,
                distribution_items: mapDistributionItems(
                    invoice.distribution_items
                ),
                items: invoice.items,
                print_status: invoice.print_status,
            });
            closeAlertDialog();
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-7xl w-full max-h-[40rem] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["shipping input.document number.search invoice"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <hr />

                <div className="grid grid-cols-[12rem_auto] gap-4">
                    <Label>
                        {m["shipping input.search invoice.customer name"]()}
                    </Label>
                    <Input
                        className="max-w-xs"
                        name="customerName"
                        value={customerInput}
                        onChange={(e) => setCustomerInput(e.target.value)}
                    />

                    <Label>
                        {m[
                            "shipping input.search invoice.pickup/delivery category.label"
                        ]()}
                    </Label>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="pickup"
                                value="1"
                                name="deliveryCategory"
                                checked={delivaryCategory.includes(1)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setDelivaryCategory((prev) => [
                                            ...prev,
                                            1,
                                        ]);
                                    } else {
                                        setDelivaryCategory((prev) =>
                                            prev.filter((cat) => cat !== 1)
                                        );
                                    }
                                }}
                            />
                            <Label htmlFor="pickup">
                                {m[
                                    "shipping input.search invoice.pickup/delivery category.pickup"
                                ]()}
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="delivery"
                                value="2"
                                name="deliveryCategory"
                                checked={delivaryCategory.includes(2)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setDelivaryCategory((prev) => [
                                            ...prev,
                                            2,
                                        ]);
                                    } else {
                                        setDelivaryCategory((prev) =>
                                            prev.filter((cat) => cat !== 2)
                                        );
                                    }
                                }}
                            />
                            <Label htmlFor="delivery">
                                {m[
                                    "shipping input.search invoice.pickup/delivery category.delivery"
                                ]()}
                            </Label>
                        </div>
                    </div>

                    <Label>
                        {m["shipping input.search invoice.date of reception"]()}
                    </Label>
                    <div>
                        <DatePicker
                            className="w-38"
                            date={dateOfReception.startDate}
                            onChange={(date) => {
                                setDateOfReception((pre) => ({
                                    ...pre,
                                    startDate: date,
                                }));
                            }}
                        />
                        <span className="mx-2">～</span>
                        <DatePicker
                            className="w-38"
                            date={dateOfReception.endDate}
                            onChange={(date) => {
                                setDateOfReception((pre) => ({
                                    ...pre,
                                    endDate: date,
                                }));
                            }}
                        />
                    </div>

                    <Label>
                        {m[
                            "shipping input.search invoice.preferred pickup date"
                        ]()}
                    </Label>
                    <div>
                        <DatePicker
                            className="w-38"
                            date={preferredCollectionDate.startDate}
                            onChange={(date) => {
                                setPreferredCollectionDate((pre) => ({
                                    ...pre,
                                    startDate: date,
                                }));
                            }}
                        />
                        <span className="mx-2">～</span>
                        <DatePicker
                            className="w-38"
                            date={preferredCollectionDate.endDate}
                            onChange={(date) => {
                                setPreferredCollectionDate((pre) => ({
                                    ...pre,
                                    endDate: date,
                                }));
                            }}
                        />
                    </div>

                    <Label>
                        {m[
                            "shipping input.search invoice.desired delivery date"
                        ]()}
                    </Label>
                    <div>
                        <DatePicker
                            className="w-38"
                            date={desiredDeliveryDate.startDate}
                            onChange={(date) => {
                                setDesiredDeliveryDate((pre) => ({
                                    ...pre,
                                    startDate: date,
                                }));
                            }}
                        />
                        <span className="mx-2">～</span>
                        <DatePicker
                            className="w-38"
                            date={desiredDeliveryDate.endDate}
                            onChange={(date) => {
                                setDesiredDeliveryDate((pre) => ({
                                    ...pre,
                                    endDate: date,
                                }));
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant={"basic"} onClick={handleSubmitFilters}>
                        {m["common.filter"]()}
                    </Button>
                    <Button
                        variant={"basic"}
                        type="reset"
                        onClick={handleClearFilters}
                    >
                        {m["shipping input.search invoice.clear"]()}
                    </Button>
                </div>

                <Table className="max-h-[0rem] overflow-y-auto text-center">
                    <TableHeader>
                        <TableRow className="[&_th]:bg-pink">
                            <TableHead className="min-w-24"></TableHead>
                            <TableHead className="min-w-24"></TableHead>
                            <TableHead>
                                {m["shipping input.document number.label"]()}
                            </TableHead>
                            <TableHead>
                                {m["shipping input.search invoice.location"]()}
                            </TableHead>
                            <TableHead>
                                {m[
                                    "shipping input.search invoice.pickup/drop-off"
                                ]()}
                            </TableHead>
                            <TableHead>
                                {m[
                                    "shipping input.search invoice.date of reception"
                                ]()}
                            </TableHead>
                            <TableHead>
                                {m[
                                    "shipping input.search invoice.preferred pickup date"
                                ]()}
                            </TableHead>
                            <TableHead>
                                {m[
                                    "shipping input.search invoice.desired delivery date"
                                ]()}
                            </TableHead>
                            {!user?.user.customer_id && (
                                <TableHead>
                                    {m[
                                        "shipping input.search invoice.customer name"
                                    ]()}
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices?.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>
                                    <Button
                                        variant="basic"
                                        type="button"
                                        onClick={() => handleEdit(invoice)}
                                    >
                                        {m["common.edit"]()}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="basic"
                                        onClick={() => handleCopy(invoice)}
                                    >
                                        {m["common.copy"]()}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {invoice.distribution_document_number}
                                </TableCell>
                                <TableCell>
                                    {invoice.delivery_location.location_name}
                                </TableCell>
                                <TableCell>
                                    {InvoiceStatus[invoice.status as OneOrTwo]}
                                </TableCell>
                                <TableCell>
                                    {format(invoice.recept_date, "yyyy-MM-dd")}
                                </TableCell>
                                <TableCell>
                                    {format(invoice.pickup_date, "yyyy-MM-dd")}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        invoice.delivery_date,
                                        "yyyy-MM-dd"
                                    )}
                                </TableCell>
                                {!user?.user.customer_id && (
                                    <TableCell>
                                        {invoice.customer.customer_name}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default SearchInvoice;
