import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { tronCheckAddress, tronCheckEvent, tronSendTRC20_USDT } from './actions';
import UploadContent from './UploadContent';
import { anyErrorToast } from './errorToast';

interface UploaderProps {
    myAddress: string;
    apiKey: string;
    privateKey: string;
    network: string;
}

const Uploader = (props: UploaderProps) => {
    const { myAddress, apiKey, privateKey, network } = props;
    const [contents, setContents] = useState<any[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [counter, setCounter] = useState<number>(10);
    const [isCounterStart, setIsCounterStart] = useState<boolean>(false);
    useEffect(() => {
        if (isCounterStart) {
            if (counter === 0) {
                setIsCounterStart(false);
                return;
            }
            const timer = setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [isCounterStart, counter])
    const sendUSDT = async () => {
        const resData: any[] = [];
        let id = 1;
        for await (const item of contents) {
            try {
                const res = await tronSendTRC20_USDT(myAddress, item.ToAddress, apiKey, privateKey, parseFloat(item.USDT), network);
                if (res?.created) {
                    const txID = res.txID;
                    resData.push({ id: id, txID: txID, status: "created" });
                    id += 1;
                } else {
                    resData.push({ id: id, txID: res?.txID, status: res?.code });
                    id += 1;
                }
            } catch (error: any) {
                console.log(error);
                anyErrorToast(error.message);
                return;
            }
        }
        setContents(resData);
        setIsCounterStart(true);
        return;
    }
    const checkResult = async () => {
        const transRecord: any[] = [];
        let id = 1;
        try {
            for await (const item of contents) {
                const res: { id?: number, txID: any, status: any } = await tronCheckEvent(apiKey, item.txID, network);
                res.id = id;
                transRecord.push(res);
            }
            setRecords(transRecord);
        } catch (error: any) {
            console.log(error);
            anyErrorToast(error.message);
        }
        return;
    }
    const sendMutation = useMutation(async () =>
        await sendUSDT()
    );
    const submitSend = async () => {
        await sendMutation.mutate();
    };
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
                    console.log(res)
                    if (res == "❌ This is a INVALID TRON account, please try other.") {
                        item.ToAddress = `${item.ToAddress} - INVALID TRON ACCOUNT`;
                    }
                    items.push(item);
                }
                setContents(items);
            },
        });
    };
    return (
        <section>
            {contents.length <= 0 && records.length <= 0 ?
                <>
                    <div className='text-zinc-300 mb-1'>* Need to follow the format of the .csv sample *</div>
                    <a href="USDT_TRC20_Transaction_Sample.csv">
                        <button className="btn-roll btn-roll-bg text-zinc-300 mb-10 w-40 h-12 
                        hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200">
                            <span className="btn-text-one">.csv Sample</span>
                            <span className="btn-text-two">Download</span>
                        </button>
                    </a>
                    <div className='relative flex justify-center mb-5'>
                        <Button className='absolute bg-[dark-bg] w-40 h-12 border-zinc-700 text-zinc-300
                        hover:shadow-[0rem_0rem_0.7rem_#FFFF80] hover:border-transparent transition hover:duration-200'>
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
                contents={contents}
                records={records}
                submitSend={submitSend}
                submitCheck={submitCheck}
                counter={counter}
                isCounterStart={isCounterStart}
                isLoading={sendMutation.isLoading}
                isChecking={checkMutation.isLoading}
            />
        </section>
    );
}

export default Uploader;