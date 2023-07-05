import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import {useWeb3Context} from "../../hook/web3Context";
import { chainData } from "../../hook/data";
import { changeNetwork, getTransaction, sendToken } from "../../hook/hook";
import { formatDecimal, shortAddress } from "../../utils/tools";
import HeaderModal from "./HeaderModal";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import AccountIcon from "../AccountIcon/AccountIcon";
import { Box, Button } from "@mui/material";
import ExchangeModal from "./ExchangeModal";
import { Navigate, NavLink, useNavigate, useSearchParams  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { buyPremium, getResources } from "../../store/user/actions";
import { ADMIN_WALLET_ADDRESS, chainId, PREMIUM_COST } from "../../hook/constants";
import { onShowAlert } from "../../store/utiles/actions";

import EggIcon from '@mui/icons-material/Egg';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WidgetsIcon from '@mui/icons-material/Widgets';
import PreniumModal from "../Modal/PremiumModal";
import config from "../../utils/config";

interface HeaderProps{
  showAccount : any;
  setShowAccount : any;
}

const Header = ({showAccount, setShowAccount}:HeaderProps) => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const newReferral = searchParams.get('ref'); 
  useEffect(() => {
    const referral = window.localStorage.getItem("REFERRAL")

    if (!referral) {
      if (newReferral) {
        window.localStorage.setItem("REFERRAL", newReferral);
      } else {
        window.localStorage.setItem("REFERRAL", config.ADMIN_ACCOUNT);
      }
    }
  }, [newReferral])

  const dispatch = useDispatch<any>();
  const userModule = useSelector((state:any) => state.userModule); 

  const [openAccount, setOpenAccount] = useState(showAccount);
  const [openPremium, setOpenPremium] = useState(false);

  const [ispremium, setIsPremium] = useState(false);
  const [leftDay, setLeftDay] = useState(0);
  const [show, setShow] = useState(false);

  const { connected, chainID, address, connect } = useWeb3Context();

  const handleOpenAccount = (flag:boolean) => {
    setOpenAccount(flag);
    setShowAccount(false);
  }

  useEffect(()=>{
    
    if(connected && address != "") {
      let referrer = window.localStorage.getItem("REFERRAL");
      referrer = referrer ? referrer : config.ADMIN_ACCOUNT
      setShow(true);
      dispatch(getResources(address, referrer, (res:any)=>{

        if(!res.success) {
          dispatch(onShowAlert(res.message, "info"));
        }
      }));
    } else {
    }
  }, [chainID, connected, address]);

  useEffect(()=>{
    let date = new Date();

    let expiredTime = new Date(userModule.user.premium);
    let curTime = new Date();
    expiredTime.setMonth( expiredTime.getMonth() + 1 );

    let curSec = date.getTime() + date.getTimezoneOffset()*60*1000;
    let endSec = expiredTime.getTime();

    if(endSec > curSec) {
      setIsPremium(true);
      setLeftDay(Math.floor((endSec-curSec)/1000/86400));
    } else {
      setIsPremium(false);
    }


  }, [userModule.user.premium])

  const getTxData = async () => {
    const data = await getTransaction();

  }

  const getPremium = async () => {

    setOpenPremium(true);
    // try{
    //   dispatch(onShowAlert("Pease wait while confirming", "info"));
    //   let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], PREMIUM_COST);
    //   dispatch(buyPremium(address, PREMIUM_COST, transaction.transactionHash, (res:any)=>{
    //     if(res.success) {
    //       dispatch(onShowAlert("Buy permium successfully", "success"));
    //     } else {
    //       dispatch(onShowAlert("Faild in buying premium", "warning"));
    //     }
    //   }));
    // } catch(e){
    //   console.log(e);
    // }
  }

  return (
    <header>
      <Box className={styles.contents}>
        <HeaderModal openAccount = {openAccount} setOpenAccount = {handleOpenAccount}/>
        <PreniumModal open = {openPremium} setOpen = {setOpenPremium} />

        <Box className={styles.gbaks} sx={{display:"flex", alignItems:"center"}}>
          
          {!ispremium && <Button variant="contained" color='success' onClick={getPremium} sx={{minWidth:"auto", mr:1}} >Premium</Button>}
          {ispremium && <p style={{whiteSpace: "nowrap", marginRight:"8px", fontWeight:700, fontSize: "18px"}}>{`${leftDay} Days`}</p>}
          
          {show && <Box className={styles.detail} >
            {/* <Box className={styles.balance}>{balance}</Box> */}
            <Button variant="contained" color='success' onClick={(e)=>{setOpenAccount(true)}}>
              <span>{shortAddress(address)}</span>
              <span style = {{display:"flex", alignItems:"center"}}><AccountIcon address={address} size = {18}/></span>
            </Button>
          </Box>}
          
          {
            !show && <Button variant="contained" color='success' sx={{zIndex:1}} onClick={(e)=>{connect()}}> Connect wallet </Button>
          }
          <p className={styles.resource} style={{backgroundColor:"#11dc65", marginLeft:"8px"}}>
            {/* <MonetizationOnIcon/> */}
            <img style={{width:"25px", marginRight:"10px"}} src="/images/res_gbaks.png"/>
            {`Gbaks: ${userModule.user.gbaks}`}
          </p>
          <p className={styles.resource} style={{backgroundColor:"#ff00da"}}>
            {/* <WidgetsIcon/> */}
            <img style={{width:"25px", marginRight:"10px"}} src="/images/res_res.png"/>
            {`Res: ${userModule.user.resource}`}
          </p>
          <p className={styles.resource} style={{backgroundColor:"yellow"}}>
            {/* <EggIcon/> */}
            <img style={{width:"20px", marginRight:"10px"}} src="/images/res_egg.png"/>
            {`Eggs: ${userModule.user.eggs}`}
          </p>
          
          <Button 
            className={styles.pvp_button}
            variant="contained" 
            color='secondary' 
            sx={{zIndex:1}} 
            onClick={(e)=>{navigate("/pvp");}}
          >
              P v P 
          </Button>

        </Box>
        
      </Box>
    </header>
  );
};

export default Header;
