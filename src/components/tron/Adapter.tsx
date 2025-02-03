import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider, WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
// This is necessary to keep style normal.
import './adapter.css';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useProfileStore } from '@/utils/store';

const Adapter = () => {
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            toast.error(e.message);
        } else if (e instanceof WalletDisconnectedError) {
            toast.error(e.message);
        } else toast.error(e.message);
    }
    return (
        <WalletProvider onError={onError}>
            <WalletModalProvider>
                <ConnectComponent>
                </ConnectComponent>
            </WalletModalProvider>
        </WalletProvider >
    );
}

function ConnectComponent() {
    const { setSenderAddress, setIsConnected, setWallet, setApiKey, setHasInfo, setTrxBalance } = useProfileStore();
    const { address, connected, disconnect, wallet } = useWallet();
    useEffect(() => {
        address ? setSenderAddress(address) : setSenderAddress("");
        connected ? setIsConnected(true) : setIsConnected(false);
        wallet ? setWallet(wallet) : setWallet("");
    }, [address, connected, wallet]);
    useEffect(() => {
        if (!connected) {
            setHasInfo(false);
            setSenderAddress("");
            setApiKey("");
            setWallet("");
            setTrxBalance(undefined)
        }
        return;
    }, [disconnect]);
    return <WalletActionButton></WalletActionButton>;
}

export default Adapter;