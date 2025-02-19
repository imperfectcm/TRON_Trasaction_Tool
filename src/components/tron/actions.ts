// @ts-ignore
import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';
import { Buffer } from 'buffer';
import { anyErrorToast } from '../../utils/errorToast';
import { approveAbi, balanceAbi, exchangeAbi } from '@/utils/abi';

const selectNetwork = async (network: string) => {
    let url: string = "";
    let usdtAddress: string = "";
    switch (network) {
        case "shasta":
            url = "https://api.shasta.trongrid.io";
            usdtAddress = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
            break;
        case "nile":
            url = "https://nile.trongrid.io";
            usdtAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
            break;
        default:
            url = "https://api.trongrid.io";
            usdtAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
            break;
    }
    return { url, usdtAddress };
}

const connectTron = async (url: string, apiKey: string, privateKey?: string) => {
    const tronWeb = new TronWeb({
        fullHost: url,
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: privateKey,
    });
    return tronWeb;
}

export const tronCheckAddress = async (address: string) => {
    try {
        const res = TronWeb.isAddress(address);
        return res;
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
}

export const tronGetBalance_TRX = async (myAddress: string, apiKey: string, network: string) => {
    const selected = await selectNetwork(network);
    const tronWeb = await connectTron(selected.url, apiKey);
    try {
        const res = await tronWeb.trx.getBalance(myAddress);
        const response = (res / 1000000);
        return response;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const tronGetBalance_USDT = async (senderAddr: string, apiKey: string, privateKey: string, network: string) => {
    window.Buffer = Buffer;
    const { url, usdtAddress } = await selectNetwork(network);
    const tronWeb = await connectTron(url, apiKey, privateKey);
    try {
        let contract = tronWeb.contract(balanceAbi, usdtAddress);
        let res = await contract.balanceOf(senderAddr).call();
        const response = ((~~res.toString(10)) / 1000000);
        return response;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const estimateEnergy_USDT = async (senderAddr: string, recipientAddr: string, apiKey: string, privateKey: string, amount: number, network: string) => {
    window.Buffer = Buffer;
    const { url, usdtAddress } = await selectNetwork(network);
    const tronWeb = await connectTron(url, apiKey, privateKey);
    const functionSelector = 'transfer(address,uint256)';
    const parameter = [{ type: 'address', value: recipientAddr }, { type: 'uint256', value: TronWeb.toSun(amount) }];
    try {
        const res = await tronWeb.transactionBuilder.estimateEnergy(usdtAddress, functionSelector, {}, parameter, tronWeb.address.toHex(senderAddr));
        return res;
    } catch (error: any) {
        console.error(error.message);
        return null;
    }
}

export const tronSendTRC20_USDT = async (senderAddr: string, recipientAddr: string, apiKey: string, privateKey: string, amount: number, network: string) => {
    window.Buffer = Buffer;
    const { url, usdtAddress } = await selectNetwork(network);
    const tronWeb = await connectTron(url, apiKey, privateKey);
    const functionSelector = 'transfer(address,uint256)';
    // const options = {
    //     feeLimit: 10000000,
    //     callValue: 0
    // };
    const parameter = [{ type: 'address', value: recipientAddr }, { type: 'uint256', value: TronWeb.toSun(amount) }];
    try {
        const tx = await tronWeb.transactionBuilder.triggerSmartContract(usdtAddress, functionSelector, {}, parameter, tronWeb.address.toHex(senderAddr));
        const signedTx = await tronWeb.trx.sign(tx.transaction);
        const res: any = await tronWeb.trx.sendRawTransaction(signedTx);
        const response = { created: res.result, code: res.code, txID: res.txid }
        return response;
    } catch (error: any) {
        console.log(error);
        if (error.response.data.Error) { anyErrorToast(error.response.data.Error); } else { anyErrorToast("Some setting might be wrong"); }
        return { created: undefined, code: undefined, txID: undefined };
    }
}

export const tronCheckEvent = async (apiKey: string, txID: string, network: string) => {
    // window.Buffer = Buffer;
    const selected = await selectNetwork(network);
    const tronWeb = await connectTron(selected.url, apiKey);
    const res: any = await tronWeb.trx.getTransaction(txID);
    const response = { txID: res.txID, status: res.ret[0].contractRet }
    return response;
}

export const checkRate = async (apiKey: string, privateKey: string, amount: number, network: string) => {
    const { url, usdtAddress } = await selectNetwork(network);
    const tronWeb = await connectTron(url, apiKey, privateKey);

    // usdt & trx exchange contract
    const exchangeAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
    const exchangeContract = tronWeb.contract(exchangeAbi, exchangeAddress);

    // usdt contract
    const usdtContract = tronWeb.contract(approveAbi, usdtAddress);
    const amountToApprove = tronWeb.toSun(amount);

    // exchange contract approvement
    try {
        const approveResult = await usdtContract.methods.approve(exchangeAddress, amountToApprove).send({
            feeLimit: 10000000,
            callValue: 0,
            shouldPollResponse: true
        });
        console.log('Approval successful:', approveResult);
    } catch (error: any) {
        console.error('Approval error:', error.message);
        return;
    }

    const tokensSold = tronWeb.toSun(amount); // amount of USDT to sell (in the smallest unit)

    try {
        const swapResult = await exchangeContract.methods.getTokenToTrxInputPrice(tokensSold).send({
            feeLimit: 10000000,
            callValue: 0,
            shouldPollResponse: true
        });
        console.log('Swap successful:', swapResult);
    } catch (error: any) {
        console.error('Swap error:', error.message);
    }

    return;

}

export const swapToken = async (apiKey: string, privateKey: string, amount: number, network: string) => {
    const { url, usdtAddress } = await selectNetwork(network);
    const tronWeb = await connectTron(url, apiKey, privateKey);

    // usdt & trx exchange contract
    const exchangeAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
    const exchangeContract = tronWeb.contract(exchangeAbi, exchangeAddress);

    // usdt contract
    const usdtContract = tronWeb.contract(approveAbi, usdtAddress);
    const amountToApprove = tronWeb.toSun(amount);

    // approve the exchange contract for the amount of USDT to be sold
    try {
        const approveResult = await usdtContract.methods.approve(exchangeAddress, amountToApprove).send({
            feeLimit: 10000000,
            callValue: 0,
            shouldPollResponse: true
        });
        console.log('Approval successful:', approveResult);
    } catch (error: any) {
        console.error('Approval error:', error.message);
        return;
    }

    const tokensSold = tronWeb.toSun(amount); // amount of USDT to sell (in the smallest unit)
    const minTrx = tronWeb.toSun(amount);     // minimum TRX to receive (in the smallest unit)
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now

    try {
        const swapResult = await exchangeContract.methods.tokenToTrxSwapInput(tokensSold, minTrx, deadline).send({
            feeLimit: 10000000,
            callValue: 0,
            shouldPollResponse: true
        });
        console.log('Swap successful:', swapResult);
    } catch (error: any) {
        console.error('Swap error:', error.message);
    }

    return;
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