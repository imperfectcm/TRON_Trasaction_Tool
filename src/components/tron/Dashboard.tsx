import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { tronGetBalance_TRX, tronGetBalance_USDT } from "./actions";
import { useState } from "react";
import PrivateKeyArea from "./PrivateKeyArea";
import CheckAddressForm from "./CheckAddressForm";
import toast, { Toaster } from 'react-hot-toast';
import Uploader from "./Uploader";

interface DashboardProps {
    connect: boolean;
    myAddress: string;
    wallet: any;
    apiKey: string;
}

const Dashboard = (props: DashboardProps) => {
    const { connect, myAddress, wallet, apiKey } = props;
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [displayCheckAddr, setDisplayCheckAddr] = useState<boolean>(false);
    const [displayUploader, setDisplayUploader] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const network = wallet?.adapter?.name || "";

    const privateKeyErrorToast = () => {
        return toast.error('Enter private key to do this action', {
            position: 'bottom-center',
            style: {
                border: '1px solid rgb(253 224 71)',
                padding: '1rem',
                color: 'rgb(212 212 216)',
                backgroundColor: 'rgb(24 24 27)',
            },
        });
    }
    const getTRXBalance = async () => {
        if (!!displayCheckAddr) setDisplayCheckAddr(false);
        if (!!displayUploader) setDisplayUploader(false);
        const res = await tronGetBalance_TRX(myAddress, apiKey, network)
        setResult(res);
        return;
    }
    const getUSDTBalance = async () => {
        if (!privateKey) return privateKeyErrorToast();
        if (!!displayCheckAddr) setDisplayCheckAddr(false);
        if (!!displayUploader) setDisplayUploader(false);
        const res = await tronGetBalance_USDT(myAddress, apiKey, privateKey, network)
        setResult(res);
        return;
    }
    const toDisplayInput = async () => {
        if (!!result) setResult(null);
        if (!!displayUploader) setDisplayUploader(false);
        if (!displayCheckAddr) setDisplayCheckAddr(true);
        return;
    }
    const toDisplayUploader = async () => {
        if (!privateKey) return privateKeyErrorToast();
        if (!!result) setResult(null);
        if (!!displayCheckAddr) setDisplayCheckAddr(false);
        if (!displayUploader) setDisplayUploader(true);
        return;
    }
    return (
        <article className="w-screen min-w-96 px-10">
            <Card className="w-full grid lg:grid-cols-4 justify-center p-5 mb-5 rounded-lg border-zinc-700 bg-[dark-bg] 
            hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent duration-200">
                <CardHeader>
                    <CardTitle className="text-zinc-300">Wallet Connection Status:</CardTitle>
                    <CardDescription className="text-zinc-500">{connect ? 'Connected' : 'Disconnected'}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle className="text-zinc-300">Your Selected Wallet:</CardTitle>
                    <CardDescription className="text-zinc-500">{wallet ? wallet.adapter.name : ""}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle className="text-zinc-300">Your TRON Address:</CardTitle>
                    <CardDescription className="text-zinc-500">{myAddress}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle className="text-zinc-300">Your API Key:</CardTitle>
                    <CardDescription className="text-zinc-500">{apiKey}</CardDescription>
                </CardHeader>
            </Card>
            {!!myAddress && !!apiKey &&
                <section>
                    <PrivateKeyArea privateKey={privateKey} setPrivateKey={setPrivateKey} />
                </section>
            }
            <section className="grid lg:grid-cols-4 gap-2 mb-10">
                <Button className='bg-[dark-bg] h-20 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                    disabled={!myAddress || !apiKey}
                    onClick={toDisplayInput}>
                    Check Address
                </Button>
                <Button className='bg-[dark-bg] h-20 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                    disabled={!myAddress || !apiKey}
                    onClick={getTRXBalance}>
                    Account Balance (TRX)
                </Button>
                <Button className='bg-[dark-bg] h-20 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                    disabled={!myAddress || !apiKey}
                    onClick={getUSDTBalance}>
                    Account Balance (USDT)
                </Button>
                <Button className='bg-[dark-bg] h-20 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                    disabled={!myAddress || !apiKey}
                    onClick={toDisplayUploader}>
                    Batch Transaction (USDT)
                </Button>
            </section>
            {!!displayCheckAddr &&
                <CheckAddressForm setResult={setResult} />
            }
            {!!displayUploader && !!privateKey &&
                <Uploader myAddress={myAddress} apiKey={apiKey} privateKey={privateKey} network={network} />
            }
            {!!result &&
                <section className="text-zinc-300">
                    {result}
                </section>
            }
            <Toaster />
        </article>
    )
}

export default Dashboard;