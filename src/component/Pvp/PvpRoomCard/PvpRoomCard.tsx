import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import styles from "./PvpRoomCard.module.scss";
import Header from "../../Header/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWeb3Context } from '../../../hook/web3Context';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST, STAKE_TIMER } from "../../../hook/constants";
import { showMinutes } from "../../../utils/timer";
import GoldMineModal from "../../Modal/GoldMineModal";
import UraniumMineModal from "../../Modal/UraniumMineModal";
import PowerPlantModal from "../../Modal/PowerPlantModal";
import { changePvpStatus, enterRoom, sendReservingStatus } from "../../../store/pvp/actions";
import { PVP_STATUS } from "../../../store/pvp/constant";
import socket from "../../../utils/socket";
import { enterRoomTransaction, removeRoomTransaction } from "../../../hook/hook";
import { IS_TEST_MODE } from "../../../utils/constants";
import { handleSpinner } from "../../../store/utiles/actions";

interface Props {
    price : string,
    status: number
    id: string,
}


const PvpRoomCard = ({price, status, id}:Props) => {

  const {address, connect} = useWeb3Context();

  const dispatch = useDispatch<any>();

  const onEnterRoom = async () => {
    
    if(!address){
      connect();
      return;
    }

    if(status==1) return alert("Can't join into closed Room");

    try{

      let result = true;
      dispatch(handleSpinner(true, "Joining Room ..."));
      sendReservingStatus(id, address);

      if(!IS_TEST_MODE)
      {
        result = await enterRoomTransaction(address, id, price); 
      }
  
      if(result) {
        
        dispatch(enterRoom(id, address, price, (res: any) =>{
          if(res.success){
            dispatch(changePvpStatus(PVP_STATUS.SELECT_UNIT));
          }
          else {
          }
        }))
      } else {
        sendReservingStatus(id, address, 2);
      }
      dispatch(handleSpinner(false, ""));
    } catch(e) {
      dispatch(handleSpinner(false, ""));
        sendReservingStatus(id, address, 2);
    } 
  }

  const onCloseRoom = async () => {
    dispatch(handleSpinner(true, "Close Room ..."));
    try{
      let result = await removeRoomTransaction(address); 

      if(result) {
        dispatch(handleSpinner(false, "Close Room ..."));
      }
    } catch(e){
      dispatch(handleSpinner(false, "Close Room ..."));
    }
    
    
  }

   return (
      <>
        <Box className={styles.cardbody}>

          <Box className={styles.room_card_bg}><img src="/images/room_card.png"/></Box>

          <Box sx={{height: "260px"}}>
            <Box className={styles.card_container}>
              
              <h2><span>{price}</span> BUSD Room</h2>
              <div>Status : {status == 0 ? "Open": status == 1 ? "Closed" : "Reserving"}</div>
              <div>
                <div><span style={{color:"lightgreen"}}>Win:</span> +{Number(price) * 8 / 5} BUSD, +{Number(price) * 6 / 5} res</div>
                <div><span style={{color:"red"}}>Lose: </span> +0 BUSD, +{Number(price) * 6 / 5} res</div>
              </div>
              <Box>
                {address != id && <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={onEnterRoom}><span>Enter</span> </Button>}
                {address == id && <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={onCloseRoom}><span>Close</span> </Button>}
              </Box>

            </Box>
          </Box>

        </Box>
      </>
  )};

export default PvpRoomCard;
