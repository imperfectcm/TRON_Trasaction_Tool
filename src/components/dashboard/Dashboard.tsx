
import { tronGetBalance_TRX } from "../tron/actions";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { useContainerStore, useProfileStore } from "@/utils/store";
import Uploader from "./Uploader";
import BalanceBox from "./BalanceBox";
import AccountInfo from "./AccountInfo";
import FunctionBtn from "./FunctionBtn";
import AddressBox from "./AddressBox";
import SingleTransfer from "./SingleTransfer";
import SwapBox from "./SwapBox";

const Dashboard = () => {
    const { senderAddress, wallet, apiKey, setTrxBalance, privateKey, setPrivateKey, network, setNetwork, hasUpdated } = useProfileStore();
    const container = useContainerStore();

    // const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => { return setNetwork(wallet?.adapter?.name || "") }, [wallet?.adapter]);

    // auto get TRX balance
    useEffect(() => {
        if (!apiKey) return setPrivateKey(null);
        (async () => {
            const res = await tronGetBalance_TRX(senderAddress, apiKey, network);
            if (!res) return;
            setTrxBalance(res)
        })()
        return;
    }, [apiKey, hasUpdated])

    return (
        <article className="w-screen min-w-96 px-5 lg:px-10">
            <AccountInfo />
            <FunctionBtn />
            {container.addressBox &&
                <AddressBox />
            }
            {container.balanceBox &&
                <BalanceBox />
            }
            {container.swapBox &&
                <SwapBox />}
            {container.transferBox &&
                <SingleTransfer />
            }
            {container.batchTransferBox && !!privateKey &&
                <Uploader />
            }
            <Toaster />
        </article>
    )
}

export default Dashboard;