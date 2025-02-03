import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTransactionStore } from "@/utils/store";
import { Copy } from "lucide-react";

interface UploadContentProps {
    cancelUpload: () => void;
    sendUSDT: () => Promise<string | undefined>;
    submitCheck: () => Promise<void>;
    isChecking: boolean;
}

const UploadContent = (props: UploadContentProps) => {
    const { totalTransaction, doneTransaction, contents, results, records, resetContents, isLoading, isCounterStarted, counter } = useTransactionStore();
    const { cancelUpload, sendUSDT, submitCheck, isChecking } = props;

    return (
        <div className="flex flex-col text-zinc-300 gap-2" >
            {contents.length > 0 && contents[0].ToAddress && results.length === 0 &&
                <div>
                    <div className="grid lg:grid-cols-2 gap-2">
                        <Button className='w-full h-16 text-2xl border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                        hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                            onClick={cancelUpload} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='w-full h-16 text-2xl border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                                hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
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
                                {totalTransaction > 0 && doneTransaction === 0 ?
                                    <div>Total transactions: {totalTransaction}</div>
                                    :
                                    <div>Transaction processing: {doneTransaction} / {totalTransaction}</div>
                                }
                                {isLoading &&
                                    <div className="tran-spinner">
                                        <div className="tran-spinner1"></div>
                                    </div>
                                }
                                <DialogFooter className="flex items-center space-x-2">
                                    <Button onClick={sendUSDT} disabled={isLoading} className="border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                                    hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200" >
                                        {!isLoading ? "Confirm" : "Transfering..."}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-3 text-lg font-semibold">
                        <p className="col-span-1">ID:</p>
                        <p className="col-span-1">Receiver Address:</p>
                        <p className="col-span-1">Amount (USDT):</p>
                    </div>
                </div>
            }
            {contents.length > 0 && contents[0].ToAddress && results.length === 0 && contents.map((item, i) =>
                <div className="grid grid-cols-3 gap-x-2 border-t-2" key={i}>
                    <p className="col-span-1 mt-2">{item.id}</p>
                    {item.ToAddress.includes("INVALID TRON ACCOUNT") ?
                        <p className="col-span-1 truncate mt-2 text-red-600">{item.ToAddress}</p>
                        :
                        <p className="col-span-1 truncate mt-2">{item.ToAddress}</p>
                    }
                    <p className="col-span-1 mt-2 truncate">{item.USDT}</p>
                </div>
            )}

            {results.length > 0 && results[0].txID &&
                <>
                    <div className="w-full text-2xl font-semibold">Results:</div>
                    <div className="w-full grid grid-cols-6 gap-x-2 text-xl font-semibold mt-5">
                        <p className="col-span-1 mt-2 truncate text-center">ID:</p>
                        <p className="col-span-1 mt-2 truncate text-center">Receiver Address::</p>
                        <p className="col-span-1 mt-2 truncate text-center">Amount (USDT):</p>
                        <p className="col-span-2 mt-2 truncate text-center">Record TxID:</p>
                        <p className="col-span-1 mt-2 truncate text-center">Status:</p>
                    </div>
                </>
            }
            {results.length > 0 && results.map((item, i) =>
                item.txID ?
                    <div className="grid grid-cols-6 gap-x-2 border-t-2" key={i}>
                        <p className="col-span-1 mt-2 truncate text-center">{item.id && item.id}</p>
                        <p className="col-span-1 mt-2 truncate text-center">{item.receiver && item.receiver}</p>
                        <p className="col-span-1 mt-2 truncate text-center">{item.amount && item.amount}</p>
                        <p className="relative col-span-2 mt-2 px-7 truncate text-center">
                            <span className="relative">
                                {item.txID && item.txID}
                                <span className="absolute h-full left-0 top-0 -translate-x-7">
                                    <Button className="p-[0.2rem] h-full bg-neutral-600"
                                        onClick={() => { navigator.clipboard.writeText(item.txID) }}>
                                        <Copy size={16} strokeWidth={1.25} />
                                    </Button>
                                </span>
                            </span>
                        </p>
                        {
                            item.status == "created" ?
                                <p className="col-span-1 mt-2 text-center">Transaction was created</p>
                                :
                                <p className="col-span-1 mt-2 text-center text-red-600">Failed - {item.status}</p>
                        }
                    </div>
                    :
                    ""
            )}

            {
                results.length > 0 && results[0].txID &&
                <div className="w-full grid grid-cols-2 gap-3">
                    <Button className='bg-[dark-bg] w-full h-16 text-xl border-zinc-700 bg-zinc-800 text-zinc-300 mt-10
                    hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                        onClick={resetContents}>
                        Clear
                    </Button>
                    <Button className='bg-[dark-bg] w-full h-16 text-xl border-zinc-700 bg-zinc-800 text-zinc-300 mt-10
                    hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'
                        onClick={submitCheck} disabled={isCounterStarted}>
                        {!isChecking ?
                            isCounterStarted ?
                                `Check Transaction - ${counter}`
                                :
                                "Check Transaction"
                            :
                            "Checking..."
                        }
                    </Button>
                </div>
            }

            {
                records.length > 0 && records[0].txID &&
                <div className="w-full grid grid-cols-3 gap-x-2 text-xl font-semibold">
                    <p className="col-span-1 mt-2 truncate text-center">ID:</p>
                    <p className="col-span-1 mt-2 truncate text-center">Check TxID:</p>
                    <p className="col-span-1 mt-2 text-center">Transaction Status:</p>
                </div>
            }
            {
                records.length > 0 && records.map((item, i) =>
                    item.txID ?
                        <div className="grid grid-cols-3 gap-x-2 border-t-2" key={i}>
                            <p className="col-span-1 mt-2 truncate text-center">{item.id}</p>
                            <p className="col-span-1 mt-2 truncate text-center">{item.txID}</p>
                            {item.status == "SUCCESS" ?
                                <p className="col-span-1 mt-2 text-center text-emerald-400">{item.status}</p>
                                :
                                <p className="col-span-1 mt-2 text-center text-red-600">Failed - {item.status}</p>
                            }
                        </div>
                        :
                        ""
                )
            }
        </div >
    )
};

export default UploadContent;