import { useWallet, WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider, WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
// This is necessary to keep style normal.
import './adapter.css';
import { WalletDisconnectedError, WalletError, WalletNotFoundError } from '@tronweb3/tronwallet-abstract-adapter';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface AdapterProps {
    setMyAddress: React.Dispatch<React.SetStateAction<string>>;
    setConnect: React.Dispatch<React.SetStateAction<boolean>>;
    setWallet: React.Dispatch<React.SetStateAction<any>>;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
    setHasInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const Adapter = (props: AdapterProps) => {
    const { setMyAddress, setConnect, setWallet, setApiKey, setHasInfo } = props;
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
                <ConnectComponent
                    setMyAddress={setMyAddress}
                    setConnect={setConnect}
                    setWallet={setWallet}
                    setApiKey={setApiKey}
                    setHasInfo={setHasInfo}>
                </ConnectComponent>
            </WalletModalProvider>
        </WalletProvider>
    );
}

function ConnectComponent({ setMyAddress, setConnect, setWallet, setApiKey, setHasInfo }: any) {
    // const { connect, disconnect, select, connected } = useWallet();
    const { address, connected, disconnect, wallet } = useWallet();
    useEffect(() => {
        address ? setMyAddress(address) : setMyAddress("");
        connected ? setConnect(true) : setConnect(false);
        wallet ? setWallet(wallet) : setWallet("");
    }, [address, connected, wallet]);
    useEffect(() => {
        if (!connected) {
            setHasInfo(false);
            setMyAddress("");
            setApiKey("");
        }
    }, [disconnect]);
    return <WalletActionButton></WalletActionButton>;
}

export default Adapter;