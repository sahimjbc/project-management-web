import { m } from "@/paraglide/messages";

interface NavLink {
    label: string;
    path: string;
    icon?: React.ReactNode;
    external?: boolean;
    id: UserPermission;
}

interface NavGroup {
    key: string;
    group: string;
    links: NavLink[];
}

export const navLinks: NavGroup[] = [
    {
        key: "master_maintenance",
        group: m["links.master"](),
        links: [
            {
                label: m["links.user master maintenance"](),
                path: "/users",
                id: "user_master_maintenance",
            },
            {
                label: m["links.customer master maintenance"](),
                path: "/customers",
                id: "customer_master_maintenance",
            },
            {
                label: m["links.collection destination master maintenance"](),
                path: "/pickup",
                id: "collection_destination_master_maintenance",
            },
            {
                label: m["links.delivery destination master maintenance"](),
                path: "/delivery",
                id: "delivery_destination_master_maintenance",
            },
        ],
    },
    {
        key: "master_maintenance",
        group: m["links.managment report"](),
        links: [
            {
                label: m["links.delivery schedule"](),
                path: "/delivery-list",
                id: "delivery_schedule",
            },
        ],
    },
    {
        key: "shipping_menu",
        group: m["links.shipping input"](),
        links: [
            {
                label: m["links.shipping input"](),
                path: "/shipping-input",
                id: "shipping_input",
            },
            {
                label: m["links.collection request list"](),
                path: "/pickup-list",
                id: "collection_request_list",
            },
        ],
    },
    {
        key: "collection",
        group: m["links.collection"](),
        links: [
            {
                label: m["links.collection QR"](),
                path: "/collection/update-status",
                id: "collection_center_qr",
            },
        ],
    },
    {
        key: "collection_center",
        group: m["links.collection center"](),
        links: [
            {
                label: m["links.sorting QR"](),
                path: "/pickup-sort/update-status",
                id: "sorting_qr",
            },
            {
                label: m["links.collection and sorting check"](),
                path: "/pickup-sort/check",
                id: "collection_sorting_check",
            },
            {
                label: m["links.loading QR"](),
                path: "/load/update-status",
                id: "loading_qr",
            },
        ],
    },
    {
        key: "distribution_center",
        group: m["links.distribution center"](),
        links: [
            {
                label: m["links.arival at base QR"](),
                path: "/arrival/update-status",
                id: "arrival_qr",
            },
            {
                label: m["links.depot loading QR"](),
                path: "/depot/update-status",
                id: "depot_loading_qr",
            },
            {
                label: m["links.delivery complete QR"](),
                path: "/delivery/update-status",
                id: "delivery_completed_qr",
            },
        ],
    },
];
