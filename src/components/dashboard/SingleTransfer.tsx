
import { useProfileStore, useTransactionStore } from "@/utils/store";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@radix-ui/react-label";
import { anyErrorToast, privateKeyErrorToast } from "../../utils/errorToast";
import { tronCheckAddress, tronSendTRC20_USDT } from "../tron/actions";

const SingleTransfer = () => {
    const { recipientAddr, setRecipientAddr, amount, setAmount, singleResult, setSingleResult, resetSingleContents, isLoading, setIsLoading } = useTransactionStore();
    const { senderAddress, apiKey, privateKey, network, refresh } = useProfileStore();
    const sendUSDT = async () => {
        if (!privateKey) return privateKeyErrorToast();
        if (Number.isNaN(parseFloat(amount))) return anyErrorToast("Enter number in amount field.");
        const pass = await tronCheckAddress(recipientAddr);
        if (!pass) return anyErrorToast("this is an invalid TRON address.");
        setIsLoading(true);
        try {
            const res = await tronSendTRC20_USDT(senderAddress, recipientAddr, apiKey, privateKey, parseFloat(amount), network);
            if (res?.created) {
                setSingleResult({ txID: res?.txID, status: "created" })
            } else {
                setSingleResult({ txID: res?.txID, status: res?.code })
            }
            setIsLoading(false)
            refresh();
            return;
        } catch (error: any) {
            console.error(error);
            anyErrorToast(error.message);
            setIsLoading(false)
            refresh();
            return;
        }
    }

    const handleClear = () => {
        resetSingleContents();
        setIsLoading(false);
        return;
    }

    return (
        <section className="flex flex-col w-full gap-5">
            {!isLoading && !singleResult.txID &&
                <div className="grid grid-cols-9 w-full gap-4">
                    <div className="relative col-start-3 col-span-5 flex flex-col items-start gap-2">
                        <Label className="px-3">Recipient Address</Label>
                        <Input className="tron-input" placeholder="Enter recipient TRON address" onChange={(e) => setRecipientAddr(e.currentTarget.value)} />
                        <span className="tron-input-border tron-input-border-alt"></span>
                    </div>
                    <div className="relative col-start-3 col-span-5 flex flex-col items-start gap-2">
                        <Label className="px-3">USDT Amount</Label>
                        <Input className="tron-input" placeholder="Enter USDT amount" onChange={(e) => setAmount(e.currentTarget.value)} />
                        <span className="tron-input-border tron-input-border-alt"></span>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='lg:col-start-5 col-span-1 text-zinc-300 hover-light'
                                disabled={isLoading}
                            >
                                {!isLoading ?
                                    "Send"
                                    :
                                    "Transaction processing..."
                                }
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-zinc-900 flex flex-col justify-center items-center">
                            <DialogHeader>
                                <DialogTitle>Transfer Confirmation</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>Click the confirm button to proceed with the transaction.</DialogDescription>
                            <span className="text-sm flex flex-col items-center">
                                <div>Recipient address:</div>
                                <div>{recipientAddr}</div>
                            </span>
                            <span className="text-sm flex flex-col items-center">
                                <div>Amount:</div>
                                <div>{amount} USDT</div>
                            </span>
                            {isLoading &&
                                <div className="tran-spinner">
                                    <div className="tran-spinner1"></div>
                                </div>
                            }
                            <DialogFooter className="flex items-center space-x-2">
                                <DialogClose asChild>
                                    <Button onClick={() => sendUSDT()} disabled={isLoading} className="border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                                    hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200" >
                                        {!isLoading ? "Confirm" : "Transfering..."}
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            }
            {isLoading &&
                <div className="flex w-full justify-center">
                    <div className="tran-spinner">
                        <div className="tran-spinner1"></div>
                    </div>
                </div>
            }
            {!isLoading && singleResult.txID &&
                <div className="grid lg:grid-cols-9 gap-4">
                    <div className="lg:col-span-9 w-full font-semibold">Result</div>
                    <div className="lg:col-start-4 lg:col-span-3 w-full grid grid-cols-3">
                        <span className="col-span-1 text-zinc-400 text-end px-4">
                            Recipient address:
                        </span>
                        <span className="col-span-2 text-start px-4">
                            {recipientAddr}
                        </span>
                    </div>
                    <div className="lg:col-start-4 lg:col-span-3 w-full grid grid-cols-3">
                        <span className="col-span-1 text-zinc-400 text-end px-4">
                            Amount:
                        </span>
                        <span className="col-span-2 text-start px-4">
                            {amount} USDT
                        </span>
                    </div>
                    <div className="lg:col-start-4 lg:col-span-3 w-full grid grid-cols-3">
                        <span className="col-span-1 text-zinc-400 text-end px-4">
                            Status:
                        </span>
                        <span className={`${singleResult.status !== "created" && "text-red-500"} col-span-2 text-start px-4`}>
                            {singleResult.status}
                        </span>
                    </div>
                    {singleResult.status === "created" &&
                        <div className="lg:col-start-4 lg:col-span-3 w-full grid grid-cols-3">
                            <span className="col-span-1 text-zinc-400 text-end px-4">
                                Reference TxID:
                            </span>
                            <a target="_blank" href={`https://tronscan.org/#/transaction/${singleResult.txID}`} className="col-span-2 text-start px-4 truncate">
                                {singleResult.txID}
                            </a>
                        </div>
                    }
                    <Button className='lg:col-start-5 text-zinc-300 hover-light' onClick={handleClear} disabled={isLoading}>
                        Clear
                    </Button>
                </div>
            }
        </section>
    )
};

export default SingleTransfer;