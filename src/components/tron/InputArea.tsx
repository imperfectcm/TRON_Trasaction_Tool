import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Adapter from "./Adapter"
import { useState } from "react"

interface InputAreaProps {
    myAddress: string;
    setMyAddress: React.Dispatch<React.SetStateAction<string>>;
    connect: boolean;
    setConnect: React.Dispatch<React.SetStateAction<boolean>>;
    wallet: any;
    setWallet: React.Dispatch<React.SetStateAction<any>>;
    apiKey: string;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const InputArea = (props: InputAreaProps) => {
    const { myAddress, setMyAddress, connect, setConnect, wallet, setWallet, apiKey, setApiKey } = props;
    const [hasInfo, setHasInfo] = useState<boolean>(false);

    let FormSchema: any;
    !connect ? FormSchema = z.object({
        address: z.string().length(34, {
            message: `TRON address should start at letter "T" and consists 34 characters`,
        }),
        apiKey: z.string(),
    })
        :
        FormSchema = z.object({
            address: z.string(),
            apiKey: z.string(),
        })
    let form: any;
    !connect ?
        form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
                address: "",
                apiKey: "",
            },
        })
        :
        form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
        })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!connect) {
            setMyAddress(data.address);
        }
        setApiKey(data.apiKey);
        setHasInfo(true);
    }

    return (
        <article className="w-screen min-w-96 px-10 mb-5 grid lg:grid-cols-9 gap-2">
            <div className="col-span-2 flex items-end">
                <Adapter
                    setMyAddress={setMyAddress}
                    setConnect={setConnect}
                    setWallet={setWallet}
                    setApiKey={setApiKey}
                    setHasInfo={setHasInfo}
                />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="col-span-7 grid lg:grid-cols-7 gap-2 items-end">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-3 flex flex-col items-start">
                                <FormLabel>Connect your wallet or enter your TRON address</FormLabel>
                                <FormControl >
                                    {hasInfo ?
                                        <Input disabled value={myAddress} />
                                        :
                                        connect ?
                                            <Input value={myAddress} />
                                            :
                                            <Input className="focus:border-[#FFFF80]" placeholder="Your TRON Adress" {...field} />
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apiKey"
                        render={({ field }) => (
                            <FormItem className="lg:col-span-3 flex flex-col items-start">
                                <FormLabel>Enter your api key</FormLabel>
                                <FormControl>
                                    {hasInfo ?
                                        <Input disabled type="password" value={apiKey} />
                                        :
                                        <Input className="focus:border-[#FFFF80]" placeholder="Your Api Key" {...field} />
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {hasInfo ?
                        <Button disabled type="submit" className="col-span-1 hover-light">Submitted</Button>
                        :
                        <Button type="submit" className="col-span-1 hover-light">Submit</Button>
                    }
                </form>
            </Form>
        </article>
        // <Input type="address" placeholder="Your TRON Address" />
    )
}

export default InputArea;