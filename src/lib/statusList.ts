import { m } from "@/paraglide/messages";

export const DeliveryStatus: Record<number, string> = {
    0: m["delivery status.not collected"](),
    1: m["delivery status.collected"](),
    2: m["delivery status.sorting"](),
    3: m["delivery status.loading"](),
    4: m["delivery status.arrived at hub"](),
    5: m["delivery status.loaded at hub"](),
    6: m["delivery status.delivered"](),
} as const;

export const WaybillStatus: Record<number, string> = {
    0: m["waybill status.unprinted"](),
    1: m["waybill status.printed"](),
} as const;

export const InvoiceStatus: Record<1 | 2, string> = {
    1: m["shipping input.pickup/delivery type.pickup"](),
    2: m["shipping input.pickup/delivery type.delivery"](),
} as const;
