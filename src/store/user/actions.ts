import { GET_RESOURCES_SUCCESS, RESOURCE_CHANGE_SUCCESS } from "./action-types";
import { SWAP_RESOURCES_SUCCESS, SWAP_EGGS_SUCCESS } from "./action-types";
import { STAKE_DIAMOND_SUCCESS, STAKE_BIRD_SUCCESS } from "./action-types";
import { CLAIM_DIAMOND_SUCCESS, CLAIM_BIRD_SUCCESS } from "./action-types";
import {GET_USER_EXPERIENCE} from "./action-types";
import api from '../../utils/callApi';

var is_diamond_staking = false;
var is_diamond_claiming = false;
var is_bird_staking = false;
var is_bird_claiming = false;

export function getResources(address:any, ref:any, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user`, "post", {
      walletAddress: address,
      ref:ref
    });
    cb(res);
    dispatch({
      type: GET_RESOURCES_SUCCESS,
      payload: {data:res}
    });
  }
}

export function stakeDiamond(address:any, index:number, item:number, cb:any) {
  return async (dispatch: any) => {

    try {
      if(is_diamond_staking) return;
      is_diamond_staking = true;
      let res = await api(`user/stake/diamond`, "post", {
        walletAddress:address,
        position:index,
        diamond:item,
      });
      is_diamond_staking = false;
      cb(res);
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    } catch(e){
      is_diamond_staking = false;
    }
  }
}

export function stakeBird(address:any, position:number, cb:any) {
  return async (dispatch: any) => {

    try {
      if(is_bird_staking) return;
      is_bird_staking = true;
      let res = await api(`user/stake/bird`, "post", {
        walletAddress:address,
        position,
      });
      is_bird_staking = false;
      cb(res);
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    } catch(e) {
      is_bird_staking = false;
    }

  }
}

export function swapResources(address:any, amount:Number, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/swap/resource`, "post", {
      walletAddress:address,
      amount: amount,
    });
    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function swapEggs(address:any, amount:Number, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/swap/egg`, "post", {
      walletAddress:address,
      amount: amount,
    });
    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}


export function claimDiamond(address:any, index: number, cb:any) {
  return async (dispatch: any) => {

    try{
      if(is_diamond_claiming) return;
      is_diamond_claiming = true;
      let res = await api(`user/claim/diamond`, "post", {
        walletAddress:address,
        position:index,
      });
      is_diamond_claiming = false;
      cb(res);
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    } catch(e) {
      is_diamond_claiming = false;
    }
  }
}

export function claimBird(address:any, position:number, cb:any) {
  return async (dispatch: any) => {

    try {
      if(is_bird_claiming) return;
      is_bird_claiming = true;
      let res = await api(`user/claim/bird`, "post", {
        walletAddress:address,
        position
      });
      is_bird_claiming = false;
      cb(res);
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    } catch(e){
      is_bird_claiming = false;
    }
  }
}

export function depositRequest(address:any, amount:number, txID:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/deposit`, "post", {
      walletAddress:address,
      amount:amount,
      txID:txID,
    });
    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function withdrawRequest(address:any, amount:number, txID:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/withdraw`, "post", {
      walletAddress:address,
      amount:amount,
      txID:txID,
    });
    cb(res);
    if(res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    }
  }
}

export function buyPremium(address:any, amount:number, txID:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/buypremium`, "post", {
      walletAddress:address,
      amount:amount,
      txID:txID,
    });

    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}


export function buyMap(address:any, amount:number, txID:string, position:number, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/buymap`, "post", {
      walletAddress:address,
      amount:amount,
      txID:txID,
      position:position,
    });

    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}


export function buyMining(address:any, amount:number, txID:string, type:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/buymining`, "post", {
      walletAddress:address,
      amount:amount,
      txID:txID,
      type:type,
    });
    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function claimMining(address:any, type:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/claimmining`, "post", {
      walletAddress:address,
      type:type,
    });

    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function requestMining(address:any, type:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/requestmining`, "post", {
      walletAddress:address,
      type:type,
    });

    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function saveDiscord(address:any, discord:string, cb:any) {
  return async (dispatch: any) => {
    let res = await api(`user/discord`, "post", {
      walletAddress:address,
      discord:discord,
    });

    cb(res);
    dispatch({
      type: RESOURCE_CHANGE_SUCCESS,
      payload: {data:res}
    });
  }
}

export function getExperience(walletAddress: string) {
  console.log("send request");
  return async (dispatch: any) => {
    let res = await api(`user/exp?walletAddress=${walletAddress}`, "get");
    if(res.success) {
      dispatch({
        type: GET_USER_EXPERIENCE,
        payload: {users: res.users, ranking: res.ranking, score: res.score}
      });
    }
  }
}

export function plantAllResource(address:any, cb?:any) {
  return async (dispatch: any) => {
    let res = await api(`user/plant/set`, "post", {
      walletAddress:address,
    });
    cb(res);
    if(res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    }
  }
}
export function getAllResource(address:any, cb?:any) {
  return async (dispatch: any) => {
    let res = await api(`user/plant/get`, "post", {
      walletAddress:address,
    });
    
    cb(res);
    if(res.success) {
      dispatch({
        type: RESOURCE_CHANGE_SUCCESS,
        payload: {data:res}
      });
    }
  }
}