import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';
import { Buffer } from 'buffer';

export const tronCheckAddress = async (address: string) => {
    try {
        const res = await TronWeb.isAddress(address);
        let response: string;
        res ? response = "🟢 This is a valid TRON account." : response = "❌ This is a INVALID TRON account, please try other."
        return response;
    } catch (err) {
        console.error(err);
        throw new Error('Error getting Tron balance');
    }
}

export const tronGetBalance_TRX = async (myAddress: string, apiKey: string, network: string) => {
    let url = null;
    if (network === "shasta") {
        url = "https://api.shasta.trongrid.io";
    } else if (network === "nile") {
        url = "https://nile.trongrid.io";
    } else {
        url = "https://api.trongrid.io";
    }
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
    });
    try {
        const res = await tronWeb.trx.getBalance(myAddress);
        const response = `Available account balance: ${res / 1000000} TRX`
        return response;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const tronGetBalance_USDT = async (myAddress: string, apiKey: string, privateKey: string, network: string) => {
    window.Buffer = Buffer;
    let url = null;
    let USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    if (network === "shasta") {
        url = "https://api.shasta.trongrid.io";
        USDTContract = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
    } else if (network === "nile") {
        url = "https://nile.trongrid.io";
        USDTContract = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
    } else {
        url = "https://api.trongrid.io";
        USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    }
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey
    });
    try {
        let abi = [
            {
                'outputs': [{ 'type': 'uint256' }],
                'constant': true,
                'inputs': [{ 'name': 'who', 'type': 'address' }],
                'name': 'balanceOf',
                'stateMutability': 'View',
                'type': 'Function'
            },
            {
                'outputs': [{ 'type': 'bool' }],
                'inputs': [
                    { 'name': '_to', 'type': 'address' },
                    { 'name': '_value', 'type': 'uint256' }
                ],
                'name': 'transfer',
                'stateMutability': 'Nonpayable',
                'type': 'Function'
            }
        ];
        let contract = await tronWeb.contract(abi, USDTContract);
        let res = await contract.balanceOf(myAddress).call();
        const response = `Available account balance: ${((~~res.toString(10)) / 1000000)} USDT`;
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const estimateEnergy_USDT = async (myAddress: string, toAddress: string, apiKey: string, privateKey: string, amount: number, network: string) => {
    window.Buffer = Buffer;
    let url = null;
    let USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    if (network === "shasta") {
        url = "https://api.shasta.trongrid.io";
        USDTContract = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
    } else if (network === "nile") {
        url = "https://nile.trongrid.io";
        USDTContract = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
    } else {
        url = "https://api.trongrid.io";
        USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    }
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey
    });
    const functionSelector = 'transfer(address,uint256)';
    const parameter = [{ type: 'address', value: toAddress }, { type: 'uint256', value: amount * 1000000 }];
    try {
        const res = await tronWeb.transactionBuilder.estimateEnergy(USDTContract, functionSelector, {}, parameter, tronWeb.address.toHex(myAddress));
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const tronSendTRC20_USDT = async (myAddress: string, toAddress: string, apiKey: string, privateKey: string, amount: number, network: string) => {
    window.Buffer = Buffer;
    let url = null;
    let USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    if (network === "shasta") {
        url = "https://api.shasta.trongrid.io";
        USDTContract = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
    } else if (network === "nile") {
        url = "https://nile.trongrid.io";
        USDTContract = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
    } else {
        url = "https://api.trongrid.io";
        USDTContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
    }
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey
    });
    const functionSelector = 'transfer(address,uint256)';
    // const options = {
    //     feeLimit: 10000000,
    //     callValue: 0
    // };
    const parameter = [{ type: 'address', value: toAddress }, { type: 'uint256', value: TronWeb.toSun(amount) }];
    try {
        const tx = await tronWeb.transactionBuilder.triggerSmartContract(USDTContract, functionSelector, {}, parameter, tronWeb.address.toHex(myAddress));
        const signedTx = await tronWeb.trx.sign(tx.transaction);
        const res: any = await tronWeb.trx.sendRawTransaction(signedTx);
        const response = { success: res.result, code: res.code, txID: res.txid }
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const tronCheckEvent = async (apiKey: string, txID: string, network: string) => {
    // window.Buffer = Buffer;
    let url = null;
    if (network === "shasta") {
        url = "https://api.shasta.trongrid.io";
    } else if (network === "nile") {
        url = "https://nile.trongrid.io";
    } else {
        url = "https://api.trongrid.io";
    }
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
    });
    const res: any = await tronWeb.trx.getTransaction(txID);
    const response = { txID: res.txID, status: res.ret[0].contractRet }
    return response;
}

// export const getEvent = async () => {
//     const tronWeb = new TronWeb({
//         fullHost: "https://api.trongrid.io",
//         headers: { "TRON-PRO-API-KEY": "8221e055-43e6-4eb6-902f-c27cb3b305cd" },
//     });
//     const res: any = await tronWeb.trx.getTransaction("7d9857106fc8b50e00008342b839d7e50e2196b309a29ce773287cca4369348f");
//     console.log(res)
//     console.log("record.txID: ", res.txID, "record.contractRet: ", res.ret[0].contractRet)
//     const response = { txID: res.txID, status: res.ret[0].contractRet }
//     return response;
// }