import { z } from "zod/v4";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormField } from "../ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { usePickupImport } from "@/api/pickup.api";
import { closeAlertDialog } from "@/lib/utils";
import { m } from "@/paraglide/messages";

type PickupCSVUplaodDialogProps = {
    children: React.ReactNode;
};

function PickupCSVUplaodDialog({ children }: PickupCSVUplaodDialogProps) {
    const importData = usePickupImport();

    const form = useForm<PickupCSVUplaodType>({
        resolver: zodResolver(fileSchema),
    });

    function handleSubmit(data: PickupCSVUplaodType) {
        importData.mutate(data.file, {
            onSuccess: () => {
                form.reset();
                closeAlertDialog();
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-5xl w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {m["pickups.upload pickup CSV"]()}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            field.onChange(e.target.files[0]);
                                        } else {
                                            field.onChange(null);
                                        }
                                    }}
                                />
                            )}
                        />
                        <Button type="submit" className="mt-4">
                            {m["common.upload"]() + "CSV"}
                        </Button>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default PickupCSVUplaodDialog;

const fileSchema = z.object({
    file: z.instanceof(File).refine((file) => file.type === "text/csv", {
        message: "File must be a CSV",
    }),
});

export type PickupCSVUplaodType = z.infer<typeof fileSchema>;
