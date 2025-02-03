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

    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))

type TransactionType = {
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