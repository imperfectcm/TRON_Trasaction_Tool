import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Adapter from "./Adapter";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

interface InputAreaProps {
    myAddress: string;
    setMyAddress: React.Dispatch<React.SetStateAction<string>>;
    connect: boolean;
    setConnect: React.Dispatch<React.SetStateAction<boolean>>;
    setWallet: React.Dispatch<React.SetStateAction<any>>;
    apiKey: string;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const InputArea = (props: InputAreaProps) => {
    const { myAddress, setMyAddress, connect, setConnect, setWallet, apiKey, setApiKey } = props;
    const [hasInfo, setHasInfo] = useState<boolean>(false);

    let FormSchema = z.object({
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
        if (!hasInfo) {
            if (!connect) {
                if (data.address.trim().length === 0 || data.address.length !== 34 || data.address[0] !== "T") {
                    return toast.error('TRON Address should consists of 34 characters and start with "T"', {
                        position: 'bottom-center',
                        style: {
                            border: '1px solid rgb(253 224 71)',
                            padding: '1rem',
                            color: 'rgb(212 212 216)',
                            backgroundColor: 'rgb(24 24 27)',
                        },
                    });
                }
                setMyAddress(data.address);
            }
            if (data.apiKey.trim().length === 0) {
                return toast.error('API Key is required', {
                    position: 'bottom-center',
                    style: {
                        border: '1px solid rgb(253 224 71)',
                        padding: '1rem',
                        color: 'rgb(212 212 216)',
                        backgroundColor: 'rgb(24 24 27)',
                    },
                });
            }
            setApiKey(data.apiKey);
            setHasInfo(true);
        } else {
            setApiKey("");
            setHasInfo(false);
            return;
        }
    }

    return (
        <article className="w-screen min-w-96 px-5 lg:px-10 mb-5 grid lg:grid-cols-9 gap-2">
            <div className="lg:col-span-2 flex items-end mb-3 lg:mb-0">
                <Adapter
                    setMyAddress={setMyAddress}
                    setConnect={setConnect}
                    setWallet={setWallet}
                    setApiKey={setApiKey}
                    setHasInfo={setHasInfo}
                />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-7 grid lg:grid-cols-7 gap-2 items-end">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="relative lg:col-span-3 flex flex-col items-start mb-3 lg:mb-0">
                                <FormLabel>Connect your wallet or enter your TRON address</FormLabel>
                                <FormControl >
                                    {hasInfo ?
                                        <Input disabled value={myAddress} />
                                        :
                                        connect ?
                                            <Input value={myAddress} />
                                            :
                                            <>
                                                <Input className="tron-input" placeholder="Your TRON Adress" {...field} />
                                                <span className="tron-input-border tron-input-border-alt"></span>
                                            </>
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
                            <FormItem className="relative lg:col-span-3 flex flex-col items-start mb-3 lg:mb-0">
                                <FormLabel>Enter your API key &nbsp;&nbsp;(Create API key on <a href="https://www.trongrid.io/" target="_blank">TronGrid</a> )</FormLabel>
                                <FormControl>
                                    {hasInfo ?
                                        <Input disabled type="password" value={apiKey} />
                                        :
                                        <>
                                            <Input className="tron-input" placeholder="Your Api Key" {...field} />
                                            <span className="tron-input-border tron-input-border-alt"></span>
                                        </>
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {hasInfo ?
                        <Button className="btn-roll col-span-1 hover-light">
                            <span className="btn-text-one">Submitted</span>
                            <span className="btn-text-two">Unlock</span>
                        </Button>
                        :
                        <Button type="submit" className="col-span-1 hover-light">Submit</Button>
                    }
                </form>
            </Form>
            <Toaster />
        </article>
    )
}

export default InputArea;