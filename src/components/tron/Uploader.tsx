import { useEffect } from 'react';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { tronCheckAddress, tronCheckEvent, tronSendTRC20_USDT } from './actions';
import UploadContent from './UploadContent';
import { anyErrorToast, privateKeyErrorToast } from './errorToast';
import { useProfileStore, useTransactionStore } from '@/utils/store';
import { wait } from '@/utils/wait';


const Uploader = () => {
    const { senderAddress, apiKey, privateKey, network } = useProfileStore();
    const { contents, setContents, results, setResults, records, setRecords, setTotalTransaction, setDoneTransaction, resetContents, resetCounter, resetTranStatus, counter, setCounter, isCounterStarted, setIsCounterStarted, setIsLoading } = useTransactionStore();
    useEffect(() => {
        if (isCounterStarted) {
            if (counter === 0) {
                resetCounter();
                return;
            }
            const timer = setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [isCounterStarted, counter])

    const sendUSDT = async () => {
        if (!privateKey) return privateKeyErrorToast();
        const resData: any[] = [];
        let id = 1;

        setDoneTransaction(id);
        setIsLoading(true);
        for await (const item of contents) {
            try {
                if (id % 7 === 0) await wait(1000);
                const res = await tronSendTRC20_USDT(senderAddress, item.ToAddress, apiKey, privateKey, parseFloat(item.USDT), network);
                if (res?.created) {
                    const txID = res.txID;
                    resData.push({ id: id, txID: txID, status: "created", amount: item.USDT, receiver: item.ToAddress });
                    id += 1;
                    setDoneTransaction(id);
                } else {
                    resData.push({ id: id, txID: res?.txID, status: res?.code, amount: item.USDT, receiver: item.ToAddress });
                    id += 1;
                    setDoneTransaction(id);
                }
            } catch (error: any) {
                console.log(error);
                anyErrorToast(error.message);
                setIsLoading(false);
                return;
            }
        }
        setIsCounterStarted(true);
        setResults(resData);
        resetTranStatus();
        setIsLoading(false);
        return;
    }
    const checkResult = async () => {
        const transRecord: any[] = [];
        let id = 1;
        try {
            for await (const item of results) {
                const res: { id?: number, amount?: string, receiver?: string, txID: any, status: any } = await tronCheckEvent(apiKey, item.txID, network);
                res.id = id;
                res.amount = item.amount;
                res.receiver = item.receiver;
                transRecord.push(res);
            }
            setRecords(transRecord);
        } catch (error: any) {
            console.log(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const checkMutation = useMutation(async () =>
        await checkResult()
    );
    const submitCheck = async () => {
        await checkMutation.mutate();
    };
    const changeHandler = (event: any) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async function (results: Papa.ParseResult<any>) {
                if (!results.data[0].ToAddress) return;
                const items: any[] = [];
                for await (let item of results.data) {
                    const res = await tronCheckAddress(item.ToAddress)
                    if (res == "❌ This is a INVALID TRON account, please try other.") {
                        item.ToAddress.includes(" ") ?
                            item.ToAddress = `${item.ToAddress} - INVALID TRON ACCOUNT (Check space)`
                            :
                            item.ToAddress = `${item.ToAddress} - INVALID TRON ACCOUNT`;

                    }
                    item.USDT = await (item.USDT).replaceAll(",", "");
                    items.push(item);
                }
                setContents(items);
                setTotalTransaction(items.length)
                setDoneTransaction(0)
            },
        });
    };
    const cancelUpload = () => {
        resetContents();
        resetTranStatus();
        setIsLoading(false);
    }
    return (
        <section>
            {contents.length <= 0 && records.length <= 0 ?
                <>
                    <div>* Make sure to purchase or rent <strong>energy</strong> before initiating a TRC-20 transfer. Otherwise, the TRX will be burned. *</div>
                    <p>Energy Estimation Website: <a href="https://energyfather.com/tron-energy-calculator" target="_blank">www.energyfather.com</a></p>
                    <br />
                    <div className='text-zinc-300 mb-1'>* Need to follow the format of the .csv sample *</div>
                    <a href="USDT_TRC20_Transaction_Sample.csv">
                        <button className="btn-roll btn-roll-bg text-zinc-300 mb-10 w-40 h-12 
                        hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200">
                            <span className="btn-text-one">.csv Sample</span>
                            <span className="btn-text-two">Download</span>
                        </button>
                    </a>
                    <div className='relative flex justify-center mb-5'>
                        <Button className='absolute bg-[dark-bg] w-40 h-12 border-zinc-700 text-zinc-300
                        hover:shadow-[0rem_0rem_0.7rem_#ff6c33] hover:border-transparent transition hover:duration-200'>
                            <div className='w-40 z-20 absolute overflow-hidden'>
                                <input
                                    type="file"
                                    name="file"
                                    accept=".csv"
                                    onChange={changeHandler}
                                    className='cursor-pointer h-12 -translate-x-20 scale-x-125'
                                    style={{ display: "block", opacity: 0, color: "yellow", background: "red" }}
                                />
                            </div>
                            Upload .csv File
                        </Button>
                    </div>
                </>
                :
                <></>
            }
            <UploadContent
                cancelUpload={cancelUpload}
                sendUSDT={sendUSDT}
                submitCheck={submitCheck}
                isChecking={checkMutation.isLoading}
            />
        </section>
    );
}

export default Uploader;