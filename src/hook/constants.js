import Web3 from 'web3';

export const chainId = 56; // Main
// export const chainId = 97; // Test
// export const PREMIUM_COST = 0.01;
// export const LAND_COST = 0.01;

// export const chainId = 56;

export const REFETCH_INTERVAL = 10000; // 10 seconds

export const MIN_DEPOSIT = 320; // 320 SPX
export const MIN_WITHDRAW = 30; // 30 SPX
export const GBAKS_SPX_RATE = 10; // 10 Gbaks = 1 SPX
export const SPX_GBAKS_RATE = 1; // 1 SPX = 1 Gbaks
export const WITHDRAW_LIMIT = 5; // $5
export const WITHDRAW_LIMIT_PREMIUM = 10; // $10
export const WITHDRAW_FEE = 1; // 1 BUSD

export const PREMIUM_COST = 15; // 50

export const LAND_COST = [4320, 1000, 3240];

export const DEFAULT_MINE = {
    COST: chainId === 97 ? 1 : 8100,
    CLAIM: chainId === 97 ? 1 : 3000,
    REQUEST: chainId === 97 ? 1 : 300,
    TIMER: 24 * 60 * 60,
}

export const GOLD_MINE = {
    COST: chainId === 97 ? 1 : 5040,
    CLAIM: 300,
    REQUEST: 20,
    TIMER: 3 * 60 * 60,
}
export const URANIUM_MINE = {
    COST: chainId === 97 ? 1 : 6700,
    CLAIM: 400,
    REQUEST: 30,
    TIMER: 3 * 60 * 60,
}

export const POWER_PLANT = {
    COST: chainId === 97 ? 1 : 40000,
    CLAIM: 9000,
    REQUEST: 3000,
    TIMER: 24 * 60 * 60,
}

export const STAKE_TIMER = 3 * 60 * 60;
export const MINING_TIMER = 24 * 60 * 60;

export const RPC_URL = {
    56: "https://bsc-dataseed1.binance.org:443",
    97: "https://data-seed-prebsc-1-s3.binance.org:8545/"
};

export const NETWORK_NAMES = {
    56: "BSC Mainnet",
    97: "BSC Testnet",
};

export const ADMIN_WALLET_ADDRESS = {
    56: "0x96Ca266261F828BAB32E800F5797f0eDc2cCE66f",
    97: "0x4762099E567e738F0E49D45A16e8c53e31CeB059",
};

export const BUSD_CONTRACT_ADDRESS = {
    56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    97: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814",
};

export const NFT_CONTRACT_ADDRESS = {
    56: "0x135Eeb2ED1B006d900F091250Bd85907B652B18f", // Test
    97: "", // Test
};

export const NFT_ADMIN_ADDRESS = {
    56: "0x8e946b7453320383df75f080F7DA843c043DfB47", // Test
    97: "0x2faf8ab2b9ac8Bd4176A0B9D31502bA3a59B4b41", // Test
};

export const TOKEN_CONTRACT_ADDRESS = {
    56: "0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B",
    97: "0xE606cFd86d134b16178b95bf6E5ee8A3F55d8B4F",
};

export const POOL_WALLET_ADDRESS = {
    56: "0xBB341DaDaB336e0B517db191F51a096b3eC81d46", // CORRECT
    97: "0x0a28e740F270e2c25646F5E0189CDFE175546E29",
};

export const PVP_CONTRACT_ADDRESS = {
    56: "0x76172cE946Fa23e1d5E3890a8B943CE054D5E9a8",
    97: "0xB4BD6347c8bEE284879c79Ab7092972D8389cAD0",
};

export const TREASURY_CONTRACT_ADDRESS = {
    56: "0xDC7F99E37F4e3bE7b48a583873876b1bFeA43C2b",
    97: "",
};

export const REFERRAL_WALLET = {
    56: "0x2faf8ab2b9ac8Bd4176A0B9D31502bA3a59B4b41", // Test
    97: "0x2faf8ab2b9ac8Bd4176A0B9D31502bA3a59B4b41", // Test
};

export const MULTICALL_CONTRACT_ADDRESS = {
    56: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    97: '',
};

export const web3static = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainId]));
