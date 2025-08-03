import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react"; // adjust import
import { memo } from "react";
import type { ShippingInputFormType } from "@/routes/_authenticated/shipping-input";
import { m } from "@/paraglide/messages";
import { useQuery } from "@tanstack/react-query";
import { getSizesOptions, getWeightsOptions } from "@/api/distribution.api";
import { Input } from "@/components/ui/input";

type Props = {
    index: number;
    fieldId: string;
    onRemove: () => void;
    isRemovable: boolean;
};

function SelectParcelItemRow({ index, onRemove, isRemovable }: Props) {
    const { control } = useFormContext<ShippingInputFormType>();
    const { data: sizes = [], isLoading: isSizesLoading } =
        useQuery(getSizesOptions());
    const { data: weights = [], isLoading: isWeightsLoading } =
        useQuery(getWeightsOptions());
    return (
        <div className="col-span-2 flex justify-between gap-4 items-center">
            <span>{index + 1}</span>

            {/* Size */}
            <div className="flex items-center gap-2">
                <Label htmlFor={`size_id_${index}`}>{m["common.size"]()}</Label>
                <Controller
                    control={control}
                    name={`distribution_items.${index}.size_id`}
                    render={({ field }) => (
                        <Select
                            onValueChange={(value) =>
                                field.onChange(Number(value))
                            }
                            value={String(field.value)}
                        >
                            <SelectTrigger disabled={isSizesLoading}>
                                <SelectValue
                                    placeholder={
                                        isWeightsLoading
                                            ? m["common.loading"]()
                                            : m["common.size"]()
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {sizes.map((size) => (
                                    <SelectItem
                                        key={size.id}
                                        value={size.id.toString()}
                                    >
                                        {size.size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Weight */}
            <div className="flex items-center gap-2">
                <Label htmlFor={`weight_id_${index}`}>
                    {m["common.weight"]()}
                </Label>
                <Controller
                    control={control}
                    name={`distribution_items.${index}.weight_id`}
                    render={({ field, fieldState }) => (
                        <Select
                            onValueChange={(value) =>
                                field.onChange(Number(value))
                            }
                            value={String(field.value)}
                            disabled={isWeightsLoading}
                        >
                            <SelectTrigger error={!!fieldState.error}>
                                <SelectValue
                                    placeholder={
                                        isWeightsLoading
                                            ? m["common.loading"]()
                                            : m["common.weight"]()
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {weights.map((weight) => (
                                    <SelectItem
                                        key={weight.id}
                                        value={weight.id.toString()}
                                    >
                                        {weight.weight}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            {/* Amount */}
            <div className="flex items-center gap-2">
                <Label htmlFor={`amount_${index}`}>
                    {m["common.amount"]()}
                </Label>
                <Controller
                    control={control}
                    name={`distribution_items.${index}.amount`}
                    render={({ field, fieldState }) => (
                        <Input
                            type="number"
                            placeholder={m["common.amount"]()}
                            min={0}
                            value={field.value || ""}
                            onChange={(e) =>
                                field.onChange(Number(e.target.value))
                            }
                            error={!!fieldState.error}
                            className="w-24"
                        />
                    )}
                />
            </div>

            <Button
                type="button"
                variant="destructive"
                onClick={onRemove}
                disabled={!isRemovable}
            >
                <X />
            </Button>
        </div>
    );
}

export default memo(SelectParcelItemRow);
