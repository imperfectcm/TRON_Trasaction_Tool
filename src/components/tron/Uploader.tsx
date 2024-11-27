import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useMutation } from "react-query";
import { tronCheckEvent, tronSendTRC20_USDT } from './actions';
import UploadContent from './UploadContent';

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
    const [counterStart, setCounterStart] = useState<boolean>(false);
    useEffect(() => {
        if (counterStart) {
            if (counter === 0) {
                setCounterStart(false);
                return;
            }
            const timer = setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [counterStart, counter])
    const sendUSDT = async () => {
        const resData: any[] = [];
        let id = 1;
        for await (const item of contents) {
            const res = await tronSendTRC20_USDT(myAddress, item.ToAddress, apiKey, privateKey, parseFloat(item.USDT), network);
            if (res?.success) {
                const txID = res.txID;
                resData.push({ id: id, txID: txID, status: "success" });
                id += 1;
            } else {
                resData.push({ id: id, txID: res?.txID, status: res?.code });
                id += 1;
            }
        }
        setContents(resData);
        setCounterStart(true);
        return;
    }
    const checkResult = async () => {
        const transRecord: any[] = [];
        let id = 1;
        for await (const item of contents) {
            const res: { id?: number, txID: any, status: any } = await tronCheckEvent(apiKey, item.txID, network);
            res.id = id;
            transRecord.push(res);
        }
        setRecords(transRecord);
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
            complete: async function (results) {
                setContents(results.data)
            },
        });
    };
    return (
        <section>
            <div className='mb-5'>
                <input
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={changeHandler}
                    style={{ display: "block", margin: "10px auto" }}
                />
            </div>
            <UploadContent
                contents={contents}
                records={records}
                submitSend={submitSend}
                submitCheck={submitCheck}
                counter={counter}
                counterStart={counterStart}
                isLoading={sendMutation.isLoading}
                isChecking={checkMutation.isLoading}
            />
        </section>
    );
}

export default Uploader;