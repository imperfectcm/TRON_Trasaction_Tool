import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { tronGetBalance_TRX, tronGetBalance_USDT } from "./actions";
import { useEffect, useMemo, useReducer, useState } from "react";
import PrivateKeyArea from "./PrivateKeyArea";
import CheckAddressForm from "./CheckAddressForm";
import { Toaster } from 'react-hot-toast';
import Uploader from "./Uploader";
import { anyErrorToast, privateKeyErrorToast } from "./errorToast";

interface DashboardProps {
    connect: boolean;
    myAddress: string;
    wallet: any;
    apiKey: string;
}
interface DashboardState {
    displayCheckAddr: boolean;
    displayUploader: boolean;
    result: any;
}
const initialState: DashboardState = {
    displayCheckAddr: false,
    displayUploader: false,
    result: null,
}
const reducer = (state: DashboardState, action: any) => {
    switch (action.type) {
        case 'OPEN_ADDR_CHECKER':
            return { ...state, displayCheckAddr: true, displayUploader: false, result: null }
        case 'OPEN_UPLOADER':
            return { ...state, displayUploader: true, displayCheckAddr: false, result: null }
        case 'OPEN_BALANCE':
            return { displayCheckAddr: false, displayUploader: false, result: null }
        case 'SET_RESULT':
            return { ...state, result: action.payload.result }
        default:
            return state;
    }
}

const Dashboard = (props: DashboardProps) => {
    const { connect, myAddress, wallet, apiKey } = props;
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    const network: string = useMemo(() => { return wallet?.adapter?.name || ""; }, [wallet?.adapter])
    useEffect(() => {
        setPrivateKey(null)
    }, [apiKey])
    // Functions
    const getTRXBalance = async () => {
        if (!!state.displayUploader || !!state.displayCheckAddr) dispatch({ type: 'OPEN_BALANCE' });
        try {
            const res = await tronGetBalance_TRX(myAddress, apiKey, network);
            dispatch({ type: 'SET_RESULT', payload: { result: res } });
        } catch (error: any) {
            console.log(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const getUSDTBalance = async () => {
        if (!privateKey) return privateKeyErrorToast();
        if (!!state.displayUploader || !!state.displayCheckAddr) dispatch({ type: 'OPEN_BALANCE' });
        try {
            const res = await tronGetBalance_USDT(myAddress, apiKey, privateKey, network);
            dispatch({ type: 'SET_RESULT', payload: { result: res } });
        } catch (error: any) {
            console.log(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const toDisplayInput = async () => {
        if (!state.displayCheckAddr) dispatch({ type: 'OPEN_ADDR_CHECKER' });
        return;
    }
    const toDisplayUploader = async () => {
        if (!privateKey) return privateKeyErrorToast();
        if (!state.displayUploader) dispatch({ type: 'OPEN_UPLOADER' });
        return;
    }

    return (
        <article className="w-screen min-w-96 px-5 lg:px-10">
            <Card className="w-full grid lg:grid-cols-4 justify-center p-5 mb-5 rounded-lg text-zinc-300 border-zinc-700 bg-[dark-bg] 
            hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent duration-200">
                <CardHeader>
                    <CardTitle>Wallet Connection Status:</CardTitle>
                    <CardDescription className="text-zinc-500">{connect ? 'Connected' : 'Disconnected'}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>Your Selected Wallet:</CardTitle>
                    <CardDescription className="text-zinc-500">{wallet ? network : ""}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>Your TRON Address:</CardTitle>
                    <CardDescription className="text-zinc-500">{myAddress}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>Your API Key:</CardTitle>
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
            {!!state.displayCheckAddr &&
                <CheckAddressForm dispatch={dispatch} />
            }
            {!!state.displayUploader && !!privateKey &&
                <Uploader myAddress={myAddress} apiKey={apiKey} privateKey={privateKey} network={network} />
            }
            {!!state.result &&
                <section className="text-zinc-300">
                    {state.result}
                </section>
            }
            <Toaster />
        </article>
    )
}

export default Dashboard;