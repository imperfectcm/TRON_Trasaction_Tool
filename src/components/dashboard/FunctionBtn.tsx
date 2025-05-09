
import { Button } from "@/components/ui/button";
import { tronGetBalance_TRX, tronGetBalance_USDT } from "../tron/actions";
import { anyErrorToast, privateKeyErrorToast } from "../../utils/errorToast";
import { useContainerStore, useProfileStore } from "@/utils/store";

const FunctionBtn = () => {
    const { senderAddress, apiKey, privateKey, network } = useProfileStore();
    const container = useContainerStore();

    const getTRXBalance = async () => {
        container.switchBox("balanceBox");
        try {
            const res = await tronGetBalance_TRX(senderAddress, apiKey, network);
            container.setBalanceRes(`Available account balance: ${res} TRX`);
        } catch (error: any) {
            console.error(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const getUSDTBalance = async () => {
        if (!privateKey) return privateKeyErrorToast();
        container.switchBox("balanceBox");
        try {
            const res = await tronGetBalance_USDT(senderAddress, apiKey, privateKey, network);
            container.setBalanceRes(`Available account balance: ${res} USDT`);
        } catch (error: any) {
            console.error(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const switchSwapBox = async () => {
        if (!privateKey) return privateKeyErrorToast();
        return container.switchBox("swapBox");
        // const res = await checkRate(apiKey, privateKey, 0.1, network);
        // return res;
    }
    const switchTransferBox = async () => {
        if (!privateKey) return privateKeyErrorToast();
        return container.switchBox("transferBox");
    }
    const switchBatchTransferBox = async () => {
        if (!privateKey) return privateKeyErrorToast();
        return container.switchBox("batchTransferBox");
    }

    return (
        <section className="grid lg:grid-cols-3 gap-2 mb-16">
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                onClick={() => container.switchBox("addressBox")}>
                Check Address
            </Button>
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                disabled={!senderAddress || !apiKey}
                onClick={getTRXBalance}>
                TRX Balance
            </Button>
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                disabled={!senderAddress || !privateKey}
                onClick={getUSDTBalance}>
                USDT Balance
            </Button>
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                disabled={!senderAddress || !privateKey}
                onClick={switchSwapBox}>
                Swap TRC20 Token
            </Button>
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                disabled={!senderAddress || !privateKey}
                onClick={switchTransferBox}>
                Single TRC20 Transaction (USDT)
            </Button>
            <Button className='bg-[dark-bg] h-16 border-zinc-700 text-zinc-300
                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                disabled={!senderAddress || !privateKey}
                onClick={switchBatchTransferBox}>
                Batch TRC20 Transaction (USDT)
            </Button>
        </section>
    )
}

export default FunctionBtn;