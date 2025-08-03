import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { X } from "lucide-react";
import { m } from "@/paraglide/messages";

function AlertDialog({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return (
        <AlertDialogPrimitive.Trigger
            data-slot="alert-dialog-trigger"
            {...props}
        />
    );
}

function AlertDialogPortal({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return (
        <AlertDialogPrimitive.Portal
            data-slot="alert-dialog-portal"
            {...props}
        />
    );
}

function AlertDialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay
            data-slot="alert-dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                className
            )}
            {...props}
        />
    );
}

function AlertDialogContent({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                data-slot="alert-dialog-content"
                className={cn(
                    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    );
}

function AlertDialogHeader({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn(
                "flex justify-between items-center gap-2 text-center font-semibold sm:text-left",
                className
            )}
            {...props}
        >
            {children}
            <AlertDialogCancel id="alert-dialog-close">
                <X />
            </AlertDialogCancel>
        </div>
    );
}

function AlertDialogFooter({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className
            )}
            {...props}
        />
    );
}

function AlertDialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    );
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

function AlertDialogAction({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
    return (
        <AlertDialogPrimitive.Action
            className={cn(buttonVariants(), className)}
            {...props}
        />
    );
}

function AlertDialogCancel({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
    return (
        <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: "outline" }), className)}
            {...props}
        />
    );
}

/**
 * Customized Common Delete Dialog for Alert Dialogs
 */
function ConfirmDeleteDialog({
    title,
    description,
    onConfirm,
    children,
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root> & {
    title: string;
    description: string;
    onConfirm?: () => void;
    className?: string;
}) {
    return (
        <AlertDialog {...props}>
            <AlertDialogTrigger asChild>
                {children || (
                    <Button variant="destructive">
                        {m["common.delete"]()}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className={cn("", className)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription className="sr-only">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {description}
                <AlertDialogFooter>
                    <AlertDialogAction
                        className={cn(
                            buttonVariants({ variant: "destructive" })
                        )}
                        onClick={() => {
                            if (onConfirm) {
                                onConfirm();
                            }
                        }}
                        {...props}
                    >
                        {m["common.confirm"]()}
                    </AlertDialogAction>
                    <AlertDialogCancel>{m["common.close"]()}</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    ConfirmDeleteDialog,
};
