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

interface UploadContentProps {
    contents: any[];
    records: any[];
    cancelUpload: () => void;
    submitSend: () => Promise<void>;
    submitCheck: () => Promise<void>
    counter: number;
    isCounterStart: boolean;
    isLoading: boolean;
    isChecking: boolean;
}

const UploadContent = (props: UploadContentProps) => {
    const { contents, records, cancelUpload, submitSend, submitCheck, counter, isCounterStart, isLoading, isChecking } = props;

    return (
        <div className="flex flex-col text-zinc-300 gap-2" >
            {contents.length > 0 && contents[0].ToAddress &&
                <div>
                    <div className="grid lg:grid-cols-2 gap-2">
                        <Button className='w-full h-16 text-2xl border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                        hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                            onClick={cancelUpload} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='w-full h-16 text-2xl border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                                hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                                    disabled={isLoading}>
                                    {!isLoading ?
                                        "Transfer"
                                        :
                                        "Accessing Transaction..."
                                    }
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-zinc-900 flex flex-col justify-center items-center">
                                <DialogHeader>
                                    <DialogTitle>Transfer Confirmation</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>Click the confirm button to proceed with the transaction.</DialogDescription>
                                <DialogFooter className="flex items-center space-x-2">
                                    <Button onClick={submitSend} disabled={isLoading} className="border-zinc-700 bg-zinc-800 text-zinc-300 my-5
                                    hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200" >
                                        {!isLoading ? "Confirm" : "Transfering..."}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-3 text-lg font-semibold">
                        <p className="col-span-1">ID:</p>
                        <p className="col-span-1">To Address:</p>
                        <p className="col-span-1">Amount (USDT TRC20):</p>
                    </div>
                </div>
            }
            {contents.length > 0 && contents[0].ToAddress && contents.map((item, i) =>
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
            {contents.length > 0 && contents[0].txID &&
                <div className="w-full grid grid-cols-3 gap-x-2 text-xl font-semibold mt-5">
                    <p className="col-span-1 mt-2 truncate text-center">ID:</p>
                    <p className="col-span-1 mt-2 truncate text-center">Record TxID:</p>
                    <p className="col-span-1 mt-2 text-center">Status:</p>
                </div>
            }
            {contents.length > 0 && contents.map((item, i) =>
                item.txID ?
                    <div className="grid grid-cols-3 gap-x-2 border-t-2" key={i}>
                        <p className="col-span-1 mt-2 truncate text-center">{item.id}</p>
                        <p className="col-span-1 mt-2 truncate text-center">{item.txID}</p>
                        {item.status == "created" ?
                            <p className="col-span-1 mt-2 text-center">Transaction was created</p>
                            :
                            <p className="col-span-1 mt-2 text-center text-red-600">Failed - {item.status}</p>
                        }
                    </div>
                    :
                    ""
            )}
            {contents.length > 0 && contents[0].txID &&
                <Button className='bg-[dark-bg] w-full h-16 text-2xl border-zinc-700 bg-zinc-800 text-zinc-300 mt-10
                    hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'
                    onClick={submitCheck} disabled={isCounterStart}>
                    {!isChecking ?
                        isCounterStart ?
                            `Check Transaction Status - ${counter}`
                            :
                            "Check Transaction Status"
                        :
                        "Checking..."
                    }
                </Button>
            }
            {records.length > 0 && records[0].txID &&
                <div className="w-full grid grid-cols-3 gap-x-2 text-xl font-semibold">
                    <p className="col-span-1 mt-2 truncate text-center">ID:</p>
                    <p className="col-span-1 mt-2 truncate text-center">Check TxID:</p>
                    <p className="col-span-1 mt-2 text-center">Transaction Status:</p>
                </div>
            }
            {records.length > 0 && records.map((item, i) =>
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
            )}
        </div>
    )
};

export default UploadContent;