
import { useProfileStore } from "@/utils/store";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import PrivateKeyArea from "./PrivateKeyArea";

const AccountInfo = () => {
    const { isConnected, senderAddress, wallet, apiKey, trxBalance, network } = useProfileStore();

    return (
        <>
            <Card className="w-full grid lg:grid-cols-4 justify-center p-5 mb-5 rounded-lg text-zinc-300 border-zinc-700 bg-[dark-bg] 
            hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent duration-200">
                <CardHeader>
                    <CardTitle>Wallet Connection Status:</CardTitle>
                    <CardDescription className="text-zinc-500">{isConnected ? 'Connected' : 'Disconnected'}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>Selected Wallet:</CardTitle>
                    <CardDescription className="text-zinc-500">{wallet ? network : ""}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>TRON Address:</CardTitle>
                    <CardDescription className="text-zinc-500">{senderAddress}</CardDescription>
                </CardHeader>
                <CardHeader>
                    <CardTitle>TRX Balance:</CardTitle>
                    <CardDescription className="text-zinc-500">{apiKey ? trxBalance ? `${trxBalance} TRX` : "-" : "-"}</CardDescription>
                </CardHeader>
            </Card>
            {senderAddress && apiKey &&
                <section>
                    <PrivateKeyArea />
                </section>
            }
        </>
    )
}

export default AccountInfo;