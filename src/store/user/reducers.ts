import { LoginState, ActionTypes, GET_USER_EXPERIENCE } from "./action-types";
import { GET_RESOURCES_SUCCESS, RESOURCE_CHANGE_SUCCESS } from "./action-types";

const initialState: LoginState = {
  user: {
    gbaks: 0,
    resource: 0,
    eggs: 0,
    premium: "0",
    opendPlace: [],
    stakedDiamond:[],
    stakedBirds:[],
    miningModule:null,
    miningRequest: 0,
    goldMine:null,
    goldMineRequest: 0,
    uraniumMine:null,
    uraniumMineRequest: 0,
    powerMine:null,
    powerMineRequest:0,
    withdrawLimit:0,
    lastWithdraw:null,
    userRef: "",
    referrals: 0,
    earned: 0,
    discord:"",
  },
  leaderboard: {
    users: [],
    ranking: 0,
    score: 0
  }
};

export function userReducer(state = initialState, action: ActionTypes): LoginState {
  switch (action.type) {
    case GET_RESOURCES_SUCCESS: {
      const {data} = action.payload;
      const {user, leaderboard} = {...state};

      user.gbaks = data.gbaks;
      user.resource = data.resource;
      user.eggs = data.eggs;
      user.premium = data.premium;
      user.opendPlace = data.opendPlace;
      user.stakedDiamond = data.stakedDiamond;
      user.stakedBirds = data.stakedBirds;
      user.miningModule = data.miningModule;
      user.miningRequest = data.miningRequest;
      user.goldMine = data.goldMine;
      user.goldMineRequest = data.goldMineRequest;
      user.uraniumMine = data.uraniumMine;
      user.uraniumMineRequest = data.uraniumMineRequest;
      user.powerMine = data.powerMine;
      user.powerMineRequest = data.powerMineRequest;
      user.withdrawLimit = data.withdrawLimit;
      user.lastWithdraw = data.lastWithdraw;
      user.userRef = data.userRef;
      user.referrals = data.referrals;
      user.earned = data.earned;
      user.discord = data.discord;

      return {user, leaderboard};
    }

    case RESOURCE_CHANGE_SUCCESS: {
      const {data} = action.payload;
      const {user, leaderboard} = {...state};

      user.gbaks = data.gbaks;
      user.resource = data.resource;
      user.eggs = data.eggs;
      user.premium = data.premium;
      user.miningModule = data.miningModule;
      user.opendPlace = data.opendPlace;
      user.miningRequest = data.miningRequest;

      user.stakedDiamond = data.stakedDiamond;
      user.stakedBirds = data.stakedBirds;

      user.goldMine = data.goldMine;
      user.goldMineRequest = data.goldMineRequest;
      user.uraniumMine = data.uraniumMine;
      user.uraniumMineRequest = data.uraniumMineRequest;
      user.powerMine = data.powerMine;
      user.powerMineRequest = data.powerMineRequest;

      user.withdrawLimit = data.withdrawLimit;
      user.lastWithdraw = data.lastWithdraw;
      user.userRef = data.userRef;

      user.referrals = data.referrals;
      user.earned = data.earned;
      user.discord = data.discord;

      return {user, leaderboard};
    }

    case GET_USER_EXPERIENCE: {
      const {users, ranking, score} = action.payload;
      let {user, leaderboard} = {...state};

      leaderboard.users = users;
      leaderboard.ranking = ranking;
      leaderboard.score = score;

      console.log("leaderboard users = ", users);

      return {user, leaderboard};
    }

    default:
      return { ...state };
  }
}
