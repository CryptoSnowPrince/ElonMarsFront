import { useContext } from "react";
import Web3 from 'web3';
import BUSD_ABI from '../utils/busd_abi.json';
import SPX_ABI from '../utils/spx_abi.json';
import PVP_ABI from '../utils/pvp_abi.json'
import TREASURY_ABI from '../utils/treasury.json'

import { RefreshContext } from "./refreshContext";
import { chainData } from "./data";
import { BUSD_CONTRACT_ADDRESS, chainId, PVP_CONTRACT_ADDRESS, REFERRAL_WALLET, RPC_URL, TOKEN_CONTRACT_ADDRESS, TREASURY_CONTRACT_ADDRESS } from "./constants";

const defaultChainId = chainId;

export const changeNetwork = async (chainid) => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(`${chainid}`) }]
            })
        } catch (err) {
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Polygon',
                            chainId: Web3.utils.toHex(`${chainid}`),
                            nativeCurrency: {
                                name: 'MATIC',
                                decimals: 18,
                                symbol: 'MATIC'
                            },
                            rpcUrls: [chainData[chainid].rpc_url]
                        }
                    ]
                })
            }
        }
    }
}

export const importToken = async (tokenAddress, tokenSymbol, tokenDecimals, tokenImage) => {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
}

export const useRefresh = () => {
    const { fast, slow } = useContext(RefreshContext);
    return { fastRefresh: fast, slowRefresh: slow }
}

export const getWeb3 = (provider) => {
    // return new Web3(web3Context?.provider || new Web3.providers.HttpProvider(RPC_URL[CHAIN_ID]))
    // const { provider } = useWeb3Context();
    // console.log("useWeb3 provider = ", provider);
    return new Web3(provider);
}

// export const useContract = (abi, addr, provider) => {
//     const web3 = getWeb3(provider);
//     return new web3.eth.Contract(abi, addr);
// }

export const getCurrentChainId = async () => {
    const web3 = new Web3(window.ethereum);
    let chainid = await web3.eth.getChainId();

    console.log("Chain id = ", chainid)

    if (defaultChainId === 97) return 97;
    if (chainid !== 1 || chainid !== 56 || chainid !== 7363) return defaultChainId;

    return chainid;
}

export const sendToken = async (from, to, rawAmount) => {

    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(rawAmount.toString(), "ether");
    var tokenContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);

    let result = await tokenContract.methods.transfer(to, amount).send({
        from: from,
        gas: 270000,
        gasPrice: 0
    });

    return result;
}

export const approveSPX = async (from, to, rawAmount) => {
    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(rawAmount.toString(), "gwei");
    var tokenContract = new web3.eth.Contract(SPX_ABI, TOKEN_CONTRACT_ADDRESS[chainId]);

    let result = await tokenContract.methods.approve(to, amount).send({
        from: from
    });

    return result;
}

export const approveBUSD = async (from, to, rawAmount) => {
    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(rawAmount.toString(), "ether");
    var tokenContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);

    let result = await tokenContract.methods.approve(to, amount).send({
        from: from
    });

    return result;
}

export const depositTreasury = async (from, rawAmount) => {
    const web3 = new Web3(window.ethereum);
    // TODO
    // let referrer = window.localStorage.getItem("REFERRAL");
    // referrer = referrer ? referrer : config.ADMIN_ACCOUNT
    const referrer = REFERRAL_WALLET[chainId]
    let amount = web3.utils.toWei(rawAmount.toString(), "gwei");
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.deposit(amount, referrer).send({
        from: from
    });

    return result;
}

export const buyPremiumTreasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyPremium().send({
        from: from
    });

    return result;
}

export const buyMiningTreasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyMining().send({
        from: from
    });

    return result;
}

export const buyPlantTreasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyPlant().send({
        from: from
    });

    return result;
}

export const buyGoldTreasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyGold().send({
        from: from
    });

    return result;
}

export const buyUranTreasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyUran().send({
        from: from
    });

    return result;
}

export const buyLand1Treasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyLand1().send({
        from: from
    });

    return result;
}

export const buyLand2Treasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyLand2().send({
        from: from
    });

    return result;
}

export const buyLand3Treasury = async (from) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.buyLand3().send({
        from: from
    });

    return result;
}

export const withdrawRequestTreasury = async (from, rawAmount) => {
    const web3 = new Web3(window.ethereum);
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);
    let amount = web3.utils.toWei(rawAmount.toString(), "gwei");

    let result = await treasuryContract.methods.withdrawRequest(amount).send({
        from: from
    });

    return result;
}

export const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainId]));

export const getSpxAllowance = async (from) => {
    var spxContract = new web3.eth.Contract(SPX_ABI, TOKEN_CONTRACT_ADDRESS[chainId]);

    let result = await spxContract.methods.allowance(from, TREASURY_CONTRACT_ADDRESS[chainId]).call();

    return result;
}

export const getSpxBalance = async (from) => {
    var spxContract = new web3.eth.Contract(SPX_ABI, TOKEN_CONTRACT_ADDRESS[chainId]);

    let result = await spxContract.methods.balanceOf(from).call();

    return result;
}


export const getBusdAllowance = async (from) => {
    var busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);

    let result = await busdContract.methods.allowance(from, TREASURY_CONTRACT_ADDRESS[chainId]).call();

    return result;
}

export const getBusdBalance = async (from) => {
    var busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);

    let result = await busdContract.methods.balanceOf(from).call();

    return result;
}

export const getDailyLimitSpx = async (from) => {
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.getDailyLimitSpx(from).call();

    return result;
}

export const getDailyRequestedSpx = async (from) => {
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.getDailyRequestedSpx(from).call();

    return result;
}

export const getDailyRemainSpx = async (from) => {
    var treasuryContract = new web3.eth.Contract(TREASURY_ABI, TREASURY_CONTRACT_ADDRESS[chainId]);

    let result = await treasuryContract.methods.getDailyRemainSpx(from).call();

    return result;
}

export const deposit = async (from, to, rawAmount) => {

    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(rawAmount.toString(), "gwei");
    var tokenContract = new web3.eth.Contract(SPX_ABI, TOKEN_CONTRACT_ADDRESS[chainId]);

    let result = await tokenContract.methods.transfer(to, amount).send({
        from: from,
        gas: 270000,
        gasPrice: 0
    });

    return result;
}

// export const getTransaction = async () => {

//     const web3 = new Web3(window.ethereum);
//     const txData = await web3.eth.getTransactionReceipt('0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d');
//     const txHist = await web3.eth.getTransaction('0x0572cfd34d02f18e3baf25f67e272a10eedda878e07bfe673df152b8d9b6bf7d');
//     console.log(txData, txHist)
//     let to = txHist.input.substring(34, 74);
//     let data = txData.logs[0];
//     let wei = web3.utils.hexToNumberString(data.data);
//     let amount = web3.utils.fromWei(wei, "ether");

//     console.log(txData, txHist)

//     console.log("from:", txData.from, " to:", to, " token = ", data.address, " amount = ", amount, txHist.blockNumber);

//     return txData;
// }

export const createRoomTransaction = async (address, value) => {
    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(value.toString(), "ether");
    var busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);
    var pvpContract = new web3.eth.Contract(PVP_ABI, PVP_CONTRACT_ADDRESS[chainId]);

    await busdContract.methods.approve(PVP_CONTRACT_ADDRESS[chainId], amount).send({

        from: address,
        gas: 270000,
        gasPrice: 0
    });;

    let result;

    try {
        result = await pvpContract.methods.createRoom(value).send({
            from: address,
            gas: 270000,
            gasPrice: 0
        });
    } catch (e) {
        console.log(e);
    }

    return result;
}

export const enterRoomTransaction = async (address, roomid, value) => {
    const web3 = new Web3(window.ethereum);
    let amount = web3.utils.toWei(value.toString(), "ether");
    var busdContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainId]);
    var pvpContract = new web3.eth.Contract(PVP_ABI, PVP_CONTRACT_ADDRESS[chainId]);

    await busdContract.methods.approve(PVP_CONTRACT_ADDRESS[chainId], amount).send({
        from: address,
        gas: 270000,
        gasPrice: 0
    });;

    let result;

    try {
        result = await pvpContract.methods.enterCreatedRoom(roomid).send({
            from: address,
            gas: 270000,
            gasPrice: 0
        });
    } catch (e) {
        console.log(e);
    }

    return result;
}

export const removeRoomTransaction = async (address) => {
    const web3 = new Web3(window.ethereum);
    var pvpContract = new web3.eth.Contract(PVP_ABI, PVP_CONTRACT_ADDRESS[chainId]);

    let result;
    try {
        result = await pvpContract.methods.removeCreatedRoom().send({

            from: address,
            gas: 270000,
            gasPrice: 0
        });
    } catch (e) {
        console.log(e);
    }

    return result;
}



export const handleGetPrivateKey = (address) => {

};