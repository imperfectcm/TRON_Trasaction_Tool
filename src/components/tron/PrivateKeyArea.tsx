import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface PrivateKeyAreaProps {
    privateKey: string | null;
    setPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
}

const PrivateKeyArea = (props: PrivateKeyAreaProps) => {
    const { privateKey, setPrivateKey } = props;
    function onSubmit(data: z.infer<typeof FormSchema>) {
        setPrivateKey(data.privateKey);
    }
    const FormSchema = z.object({
        privateKey: z.string()
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            privateKey: "",
        },
    })

    return (
        <div className="flex w-full mb-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid lg:grid-cols-9 gap-2">
                    <FormField
                        control={form.control}
                        name="privateKey"
                        render={({ field }) => (
                            <FormItem className="relative lg:col-span-8">
                                <FormControl>
                                    {!privateKey ?
                                        <>
                                            <Input className="tron-input" placeholder="Enter your private key" {...field} />
                                            <span className="tron-input-border tron-input-border-alt"></span>
                                        </>
                                        :
                                        <Input disabled type="password" value={privateKey} />
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!privateKey ?
                        <Button type="submit" className="col-span-1 hover-light">Enter</Button>
                        :
                        <Button disabled type="submit" className="col-span-1 hover-light">Submitted</Button>
                    }
                </form>
            </Form>
        </div>
    )
}

export default PrivateKeyArea;