import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { tronCheckAddress } from "./actions"

interface CheckAddressFormProps {
    setResult: React.Dispatch<React.SetStateAction<any>>;
}
const CheckAddressForm = (props: CheckAddressFormProps) => {
    const { setResult } = props;
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const res = await tronCheckAddress(data.address);
        setResult(res);
        return;
    }
    const FormSchema = z.object({
        address: z.string()
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: "",
        },
    })

    return (
        <div className="flex w-full mb-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid lg:grid-cols-9 gap-2">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="lg:col-start-3 lg:col-span-4">
                                <FormControl>
                                    <Input className="focus:border-[#FFFF80]" placeholder="Enter TRON address to check" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="col-span-1 hover-light">Check</Button>

                </form>
            </Form>
        </div>
    )
}

export default CheckAddressForm;