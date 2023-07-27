import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { changeNetwork, getCurrentChainId, web3static } from "./hook.js";
import { ethers } from "ethers";

import { chainId, RPC_URL } from "./constants.js";


const defaultChainId = chainId;
const defaultChainRPC = RPC_URL[chainId];

const chainList = [56, 97];

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          // 1: defaultChainRPC,
          // 3: defaultChainRPC,
          56: RPC_URL[56],
          // 97: RPC_URL[97],
        },
      },
    },
  },
})

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level.",
    );
  }
  const { onChainProvider } = web3Context;
  return useMemo(() => {
    return { ...onChainProvider };
  }, [web3Context]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const useInfo = () => {
  const { address } = useWeb3Context();

  const [data, setData] = useState({

  })
  // web3static
  return data;
}

export const useNeedApprove = (amount) => {
  const { address } = useWeb3Context();
  // web3static
}

export const Web3ContextProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [chainID, setChainID] = useState(defaultChainId);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(defaultChainRPC);

  const hasCachedProvider = () => {
    if (!web3Modal) return false;
    if (!web3Modal.cachedProvider) return false;
    return true;
  };

  const subscribeProvider = useCallback((provider) => {
    setProvider(provider);

    provider.on("disconnect", (err) => {
      //setChainID(1);
      // setAddress("");
    });
    provider.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
    });
    provider.on("chainChanged", async (chainId) => {
      const isValid = _checkNetwork(chainId);

      console.log("ChangeChange", chainId);

      if (!isValid) {
        setChainID(Number(chainId));
        changeNetwork();
      }

    })
  }, [provider]);

  /**
   * throws an error if networkID is not 1 (mainnet) or 4 (rinkeby)
   */
  const _checkNetwork = (otherChainID) => {

    if (chainID !== otherChainID) {
      console.warn("You are switching networks", chainId, otherChainID);

      if (chainList.includes(Number(otherChainID))) {
        console.log("Asdf");
        setChainID(Number(otherChainID));
        return true;
      }
      return false;
    }
    return true;
  };

  // connect - only runs for WalletProviders
  const connect = useCallback(async () => {
    const _rawProvider = await web3Modal.connect();
    // new _initListeners implementation matches Web3Modal Docs
    // ... see here: https://github.com/Web3Modal/web3modal/blob/2ff929d0e99df5edf6bb9e88cff338ba6d8a3991/example/src/App.tsx#L185
    subscribeProvider(_rawProvider);

    const connectedProvider = new Web3Provider(_rawProvider, "any");

    const chainId = await connectedProvider.getNetwork().then(network => network.chainId);
    const connectedAddress = await connectedProvider.getSigner().getAddress();
    const validNetwork = _checkNetwork(chainId);
    if (!validNetwork) {
      console.error("Wrong network, please switch to BSC network");
      changeNetwork(chainID);
      return;
    }
    // Save everything after we've validated the right network.
    // Eventually we'll be fine without doing network validations.
    setAddress(connectedAddress);

    // Keep this at the bottom of the method, to ensure any repaints have the data we need
    setConnected(true);

    return connectedProvider;
  }, [provider, web3Modal, connected]);

  const disconnect = useCallback(async () => {
    console.log("disconnecting");
    await web3Modal.clearCachedProvider();
    setConnected(false);
    setAddress("");
  }, [provider, web3Modal, connected]);

  const setCurrentChain = async () => {
    let _chain = await getCurrentChainId();
    setChainID(Number(_chain));
  }

  useEffect(() => {
    // setCurrentChain();
    // if(web3Modal.cachedProvider) {
    //   connect();
    // } else {
    //   const _provider = new ethers.providers.StaticJsonRpcProvider(defaultChainRPC, defaultChainId);
    //   setProvider(_provider);
    //   subscribeProvider(_provider);
    // }
  }, []);

  const onChainProvider = useMemo(
    () => ({ connect, disconnect, hasCachedProvider, provider, connected, address, chainID }),
    [connect, disconnect, hasCachedProvider, provider, connected, address, chainID],
  );

  return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
