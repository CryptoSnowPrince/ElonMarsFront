export const API_KEY = "MTTUSJK947YRSY5YIA8QP8Z9JMK9FQ87R4";

export const chainData = {
  // 1: {
  //   symbol: "ETH",   
  //   chain: "Ethereum",
  //   chainName: "Ethereum mainnet",
  //   chainid: 1,
  //   rpc_url: "https://mainnet.infura.io/v3/e7514295cf064e66a31b1e2dbd57424c",
  //   explorer: "https://etherscan.io",
  //   isfavourite: false,
  //   defaultCoin: "0",
  //   tokenList: [
  //     {name: "Ethereum",    symbol:"ETH",    address:"0", decimal:18},
  //     {name: "Binance Coin",   symbol:"BNB",    address:"0xB8c77482e45F1F44dE1745F52C74426C631bDD52", decimal:18},
  //     {name: "Dyno USD",    symbol:"DUSD",    address:"0x2170ed0880ac9a755fd29b2688956bd959f933f8", decimal:18},
  //   ]
  // },
  // // BNB, ETH, DUSD
  // 56: {
  //   symbol: "BNB",
  //   chain: "Binance",
  //   chainName: "BNB CHAIN mainnet",
  //   chainid: 56,
  //   rpc_url: "https://bsc-dataseed1.binance.org",
  //   explorer: "https://bscscan.com/",
  //   isfavourite: false,
  //   defaultCoin: "0",
  //   tokenList: [
  //     {name: "Binance",    symbol:"BNB",    address:"0", decimal:18},
  //     {name: "Ethereum",    symbol:"ETH",    address:"0x2170ed0880ac9a755fd29b2688956bd959f933f8", decimal:18},
  //     {name: "Dyno USD",    symbol:"DUSD",    address:"0x2170ed0880ac9a755fd29b2688956bd959f933f1", decimal:18},
  //   ]
  // },

  // 7363: {
  //   symbol: "DND",
  //   chain: "DynoChain",
  //   chainName: "DynoChain mainnet",
  //   chainid: 7363,
  //   rpc_url: "https://rpc.dynochain.io/",
  //   explorer: "https://dynoscan.io/",
  //   isfavourite: false,
  //   defaultCoin: "0xdAC17F958D2ee523a2206206994597C13D831ec1",
  //   tokenList: [
  //     {name: "Dyno USD",    symbol:"DUSD",    address:"0xdAC17F958D2ee523a2206206994597C13D831ec1", decimal:6},
  //     {name: "Ethereum",    symbol:"ETH",    address:"0xdAC17F958D2ee523a2206206994597C13D831ec2", decimal:18},
  //     {name: "Binance",    symbol:"BNB",    address:"0xdAC17F958D2ee523a2206206994597C13D831ec3", decimal:18},
  //   ]
  // },
  

  56: {
    symbol: "BNB",   
    chain: "BSC Mainnet",
    chainName: "Binance mainnet",
    chainid: 56,
    rpc_url: "https://mainnet.infura.io/v3/e7514295cf064e66a31b1e2dbd57424c",
    explorer: "https://bscscan.com",
    isfavourite: false,
    defaultCoin: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    router: "0x66b2FAFc8c5FC3A85d845804d156e9DEd21f321D",
    tokenList: [
      {name: "Wrapped BNB",    symbol:"WBNB",    address:"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", decimal:18},
      {name: "Dyno Token",   symbol:"WDND",    address:"0x3170Cad872f6f7Dccb398b0538D149fD01c1F882", decimal:18},
      {name: "Dyno USD",    symbol:"DUSD",    address:"0x7E862715C41DD918f14d545F68D68ed23888E203", decimal:18},
    ]
  },

  ////// test net
  97: {
    symbol: "WBNB",   
    chain: "BSC Test",
    chainName: "Binance testnet",
    chainid: 97,
    rpc_url: "https://mainnet.infura.io/v3/e7514295cf064e66a31b1e2dbd57424c",
    explorer: "https://etherscan.io",
    isfavourite: false,
    defaultCoin: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    router: "0x66b2FAFc8c5FC3A85d845804d156e9DEd21f321D",
    tokenList: [
      {name: "Wrapped BNB",    symbol:"WBNB",    address:"0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", decimal:18},
      {name: "Dyno Token",   symbol:"WDND",    address:"0x3170Cad872f6f7Dccb398b0538D149fD01c1F882", decimal:18},
      {name: "Dyno USD",    symbol:"DUSD",    address:"0x7E862715C41DD918f14d545F68D68ed23888E203", decimal:18},
    ]
  },

  7364: {
    symbol: "DND",
    chain: "DynoChain",
    chainName: "DND Network Testnet",
    chainid: 7364,
    rpc_url: "https://rpc.dynochain.io/",
    explorer: "https://dynoscan.io/",
    isfavourite: false,
    defaultCoin: "0",
    router: "0xDc3D17217906b93aBf1be6BA6fa05bD1d9215451",
    tokenList: [
      {name: "Dyno USD",    symbol:"DUSD",    address:"0xBE3735517eB0C286E581A54f802D1218cFE781fD", decimal:18},
      {name: "'Dyno Chain Native Token",    symbol:"WDND",    address:"0", decimal:18},
    ]
  },
}



export const getTokenDetail = (chain, address) => {

  let result = {};

  if(!chainData[chain]) return;

  for (let item of chainData[chain].tokenList) {
    if(item.address == address) {
      return {...item};
    }
  }

  for (let item of chainData[chain].tokenList) {
    if(item.address == 0) {
      return {...item};
    }
  }

  return {name: "Ethereum",    symbol:"ETH",    address:"0", decimal:18};
}

export const getSameTokenAddress = (chain1, chain2, tokenaddress) => {

  if(!chainData[chain1]) return;
  if(!chainData[chain2]) return;

  let symbol;
  for (let item of chainData[chain1].tokenList) {
    if(item.address == tokenaddress) {
      symbol = item.symbol;
    }
  }

  for (let item of chainData[chain2].tokenList) {
    if(item.symbol == symbol) {
      return {...item};
    }
  }

  return null;
}