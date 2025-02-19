import { create } from 'zustand'

type ProfileType = {
    senderAddress: string;
    isConnected: boolean;
    wallet: any;
    apiKey: string;
    hasInfo: boolean;
    network: string;

    privateKey: string | null;
    trxBalance: number | undefined;

    hasUpdated: boolean;
    isLoading: boolean;
}

type ProfileAction = {
    setSenderAddress: (senderAddress: string) => void;
    setIsConnected: (isConnected: boolean) => void;
    setWallet: (wallet: any) => void;
    setApiKey: (apiKey: string) => void;
    setHasInfo: (hasInfo: boolean) => void;
    setNetwork: (network: string) => void;

    setPrivateKey: (privateKey: string | null) => void;
    setTrxBalance: (trxBalance: number | undefined) => void;

    refresh: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useProfileStore = create<ProfileType & ProfileAction>((set) => ({
    senderAddress: "",
    isConnected: false,
    wallet: undefined,
    apiKey: "",
    hasInfo: false,
    network: "",

    privateKey: null,
    trxBalance: undefined,

    setSenderAddress: (senderAddress: string) => set({ senderAddress }),
    setIsConnected: (isConnected: boolean) => set({ isConnected }),
    setWallet: (wallet: any) => set({ wallet }),
    setApiKey: (apiKey: string) => set({ apiKey }),
    setHasInfo: (hasInfo: boolean) => set({ hasInfo }),
    setNetwork: (network: string) => set({ network }),

    setPrivateKey: (privateKey: string | null) => set({ privateKey }),
    setTrxBalance: (trxBalance: number | undefined) => set({ trxBalance }),

    hasUpdated: false,
    refresh: () => set(state => ({ hasUpdated: !state.hasUpdated })),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

type TransactionType = {
    // single transaction
    recipientAddr: string;
    amount: string;
    singleResult: any;

    // batch transactions
    contents: any[];
    results: any[];
    records: any[];

    totalTransaction: number;
    doneTransaction: number;

    counter: number;
    isCounterStarted: boolean;

    isLoading: boolean;
}

type TransactionAction = {
    // single transaction
    setRecipientAddr: (recipientAddr: string) => void;
    setAmount: (amount: string) => void;
    setSingleResult: (singleResult: any) => void;

    resetSingleContents: () => void;

    // batch transactions
    setContents: (contents: any[]) => void;
    setResults: (result: any[]) => void;
    setRecords: (records: any[]) => void;

    setTotalTransaction: (totalTransaction: number) => void;
    setDoneTransaction: (doneTransaction: number) => void;

    setCounter: (counter: number) => void;
    setIsCounterStarted: (isCounterStarted: boolean) => void;

    setIsLoading: (isLoading: boolean) => void;

    resetContents: () => void;
    resetCounter: () => void;
    resetTranStatus: () => void;
}

export const useTransactionStore = create<TransactionType & TransactionAction>((set) => ({
    // single transaction
    recipientAddr: "",
    amount: "",
    setRecipientAddr: (recipientAddr: string) => set({ recipientAddr }),
    setAmount: (amount: string) => set({ amount }),

    singleResult: {},
    setSingleResult: (singleResult: any) => set({ singleResult }),

    resetSingleContents: () => set({ recipientAddr: "", amount: "", singleResult: {}, }),

    // batch transactions
    contents: [],
    results: [],
    records: [],

    totalTransaction: 0,
    doneTransaction: 0,

    counter: 10,
    isCounterStarted: false,

    setContents: (contents: any[]) => set({ contents }),
    setResults: (results: any[]) => set({ results }),
    setRecords: (records: any[]) => set({ records }),
    setTotalTransaction: (totalTransaction: number) => set({ totalTransaction }),
    setDoneTransaction: (doneTransaction: number) => set({ doneTransaction }),

    setCounter: (counter: number) => set({ counter }),
    setIsCounterStarted: (isCounterStarted: boolean) => set({ isCounterStarted }),

    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),

    resetContents: () => set({ contents: [], results: [], records: [] }),
    resetCounter: () => set({ counter: 10, isCounterStarted: false }),
    resetTranStatus: () => set({ totalTransaction: 0, doneTransaction: 0 })
}))

type ContainerType = {
    btnOptions: any[],

    addressBox: boolean;
    addressRes: string;

    balanceBox: boolean;
    balanceRes: string;

    swapBox: boolean;
    transferBox: boolean;
    batchTransferBox: boolean;

    isLoading: boolean;
}

type ContainerAction = {
    setBtnOptions: (btnOptions: any) => void;

    setAddressBox: (addressBox: boolean) => void;
    setAddressRes: (addressRes: string) => void;

    setBalanceBox: (balanceBox: boolean) => void;
    setBalanceRes: (balanceRes: string) => void;

    setSwapBox: (swapBox: boolean) => void;

    setTransferBox: (transferBox: boolean) => void;
    setBatchTransferBox: (batchTransferBox: boolean) => void;

    switchBox: (boxName: string) => void;
    reset: () => void;

    setIsLoading: (isLoading: boolean) => void;
}

export const useContainerStore = create<ContainerType & ContainerAction>((set, get) => ({
    btnOptions: [],

    addressBox: false,
    addressRes: "",

    balanceBox: false,
    balanceRes: "",

    swapBox: false,

    transferBox: false,
    batchTransferBox: false,

    setBtnOptions: (btnOptions: any[]) => set({ btnOptions }),

    setAddressBox: (addressBox: boolean) => set({ addressBox }),
    setAddressRes: (addressRes: string) => set({ addressRes }),

    setBalanceBox: (balanceBox: boolean) => set({ balanceBox }),
    setBalanceRes: (balanceRes: string) => set({ balanceRes }),

    setSwapBox: (swapBox: boolean) => set({ swapBox }),

    setTransferBox: (transferBox: boolean) => set({ transferBox }),
    setBatchTransferBox: (batchTransferBox: boolean) => set({ batchTransferBox }),

    switchBox: (boxName: string) => {
        get().reset();
        switch (boxName) {
            case "addressBox":
                set({ addressBox: true });
                break;
            case "balanceBox":
                set({ balanceBox: true });
                break;
            case "swapBox":
                set({ swapBox: true });
                break;
            case "transferBox":
                set({ transferBox: true });
                break;
            case "batchTransferBox":
                set({ batchTransferBox: true });
                break;
            default:
                get().reset();
                break;
        }
    },
    reset: () => set({ addressRes: "", balanceRes: "", addressBox: false, balanceBox: false, swapBox: false, transferBox: false, batchTransferBox: false, }),

    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading })
}))