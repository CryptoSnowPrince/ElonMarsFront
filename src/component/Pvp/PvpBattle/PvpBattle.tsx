import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Header from '../../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useWeb3Context } from '../../../hook/web3Context';
import styles from "./PvpBattle.module.scss";
import ExchangeModal from '../../../component/Header/ExchangeModal';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import DepositModal from '../../../component/Modal/DepositModal';
import { STAKE_TIMER } from '../../../hook/constants';
import MiningModal from '../../../component/Modal/MiningModal';
import { showMinutes } from '../../../utils/timer';
import { width } from '@mui/system';
import InstructionModal from '../../../component/Modal/InstructionModal';
import { PVP_ATTACK_TURN, PVP_STATUS } from '../../../store/pvp/constant';
import { attackEndSuccess, getBattleData, setMyAddress, attack, changePvpStatus, unitAttack, unitAttackEndSuccess, closeRoomSocket, sceneReady } from '../../../store/pvp/actions';
import PvpBattleAttackCardView from './PvpBattleAttackCardView';
import { LinearProgress } from '@mui/material';
import { removeRoomTransaction } from '../../../hook/hook';
import { handleSpinner } from '../../../store/utiles/actions';
import { IS_TEST_MODE, getUnitHealth } from '../../../utils/constants';
import { startGame } from '../../../PhaserGame';



const PvpBattle = () => {
  const navigate = useNavigate();
  // var myImage:any; 
  var bullet=new Image();
  bullet.src="/images/bullet_laser.png";

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(()=>{

    window.addEventListener("ready-game-scene", (event:any) => {
      
      dispatch(sceneReady(true));
      
    });
    
    startGame();
  }, [])

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      console.log("resize");
    };
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom, roomDetail} = pvpModule;

  const { connected, chainID, address, connect } = useWeb3Context();

  const [attackAble, setAttackAble] = useState(false);

  const [waitingTime, setWaitingTime] = useState(0);

  let timer:any = null;
  const startTimer = (tm:number) => {
    clearInterval(timer);
    timer = null;
    if (timer == null && tm > 0) {
  
      timer = setInterval(()=>{
        setWaitingTime((prevTimer)=>{

          if(prevTimer == 2) {
            attackWithRandomSpell(true); 
          }
          
          if(prevTimer < 1) {
            clearInterval(timer);  
            attackWithRandomSpell(false);
            return 0;
          }
          return prevTimer-1;

        });
      }, 1000);
    }
  }

  const attackWithRandomSpell = (isMine = true) => {
    let flg_attack = checkAttackAble();

    let ability = address == pvpRoom.roomid ? pvpRoom.localPlayer.ability : pvpRoom.remotePlayer.ability
    let enemyAbility = address == pvpRoom.roomid ? pvpRoom.remotePlayer.ability : pvpRoom.localPlayer.ability
    let enemyAddress = address == pvpRoom.roomid ? pvpRoom.remotePlayer.address : pvpRoom.roomid;

    if(flg_attack) {
      
      if(isMine) dispatch(attack(pvpRoom.roomid, address, ability[0]));
    } else {
      if(!isMine) {
        console.log("enemy didn't attack", pvpRoom.roomid, enemyAddress, enemyAbility[0]);
        dispatch(attack(pvpRoom.roomid, enemyAddress, enemyAbility[0]));
      }
    }
  }



  useEffect(()=>{
    console.log("send get battle data in useEffect", roomDetail.status, roomDetail.sceneLoaded);
    if(roomDetail.status == PVP_STATUS.PLAY && roomDetail.sceneLoaded) {
      getBattleData(pvpRoom.roomid);
    }
  }, [roomDetail.sceneLoaded, roomDetail.status]);

  const checkAttackAble = () => {
    
    if(roomDetail.readyAllPlayers < 2) {
      setAttackAble(false);
      return false;
    }

    if(pvpRoom.roomid == address) { // local player
      if(roomDetail.currentTurn == PVP_ATTACK_TURN.LOCAL_PLAYER) {

        if(pvpRoom.localPlayer.hp < 0.1) {
          return false;
        }

        setAttackAble(true);
        return true;
      } else {

        if(pvpRoom.remotePlayer.hp < 0.1) {
          return false;
        }

        setAttackAble(false);
        return false;
      }
    } else { // remote player
      if(roomDetail.currentTurn == PVP_ATTACK_TURN.LOCAL_PLAYER) {
        
        if(pvpRoom.localPlayer.hp < 0.1) {
          return false;
        }

        setAttackAble(false);
        return false;
      } else {

        if(pvpRoom.remotePlayer.hp < 0.1) {
          return false;
        }

        setAttackAble(true);
        return true;
      }
    }

  }

  const unitAttackAction = () => {


    if(roomDetail.currentTurn == PVP_ATTACK_TURN.LOCAL_PLAYER){
      if(pvpRoom.localPlayer.unitHp > 0)
        dispatch(unitAttack(pvpRoom.roomid, address, pvpRoom.localPlayer.unit));
    } else {
      if(pvpRoom.remotePlayer.unitHp > 0)
        dispatch(unitAttack(pvpRoom.roomid, address, pvpRoom.remotePlayer.unit));
    }
  }

  useEffect(() => {
    
    let check = checkAttackAble();
    if(roomDetail.status==PVP_STATUS.PLAY && roomDetail.readyAllPlayers >= 2) {
      
      if (check) unitAttackAction();  
      setWaitingTime(22);
      startTimer(22);
    }

    return () => clearInterval(timer);
    
  }, [roomDetail.currentTurn, roomDetail.readyAllPlayers]);

  const onCloseRoom = async () => {

    dispatch(handleSpinner(true, "Close Room ..."));

    dispatch(handleSpinner(true, "Create the Room ..."));

    dispatch(handleSpinner(true, "Join Room ..."));

    try{

      let result = true;
      if(!IS_TEST_MODE) {
        result = await removeRoomTransaction(address); 
      }
      
      if(result) {
        closeRoomSocket(pvpRoom.roomid, address);
        dispatch(changePvpStatus(PVP_STATUS.SELECT_ROOM));
      }

      dispatch(handleSpinner(false, "Close Room ..."));

    } catch(e) {
      dispatch(handleSpinner(false, "Close Room ..."));
    }
  }

  const backToRoom = () => {    
    window.location.href = "/pvp";
    dispatch(changePvpStatus(PVP_STATUS.SELECT_ROOM));
  }

  

  const clearScene = () => {
    const myEvent = new CustomEvent('clear-scene', {
      detail: {
      },
    });
    
    // Dispatch the event on the window object
    window.dispatchEvent(myEvent);
  }
  
  return (
    <>
    
      <Box className={styles.container} sx={{width: window.innerWidth}}>

      <Box sx={{display:"flex", justifyContent:"center"}}><h3>{Math.max(0, waitingTime-2)}</h3></Box>

        {roomDetail.status == PVP_STATUS.WAITING && <Box sx={{display:"flex", justifyContent:"end"}}>
          <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>{onCloseRoom()}}> Close Room </Button>
        </Box>}

        {roomDetail.status == PVP_STATUS.PLAY && <>
          {attackAble ? <h2>Your turn</h2> : <h2>Enemy turn</h2>}
        </>}

        {roomDetail.status == PVP_STATUS.PLAY && attackAble && <PvpBattleAttackCardView isLocal = {pvpRoom.roomid == address}/>}

        {roomDetail.status == PVP_STATUS.WAITING && 
          <Box>
            <h2> Waiting <img src="/images/loading.svg" style={{width: "40px"}}/></h2>
          </Box>
        }

        {roomDetail.status == PVP_STATUS.END && <>
          {roomDetail.winner == roomDetail.myAddress ? <h2>Your Win</h2> : <h2>You Lose</h2>}
          <Box sx={{display:"flex", justifyContent:"center"}}>
            <Button variant="contained" color='primary' sx={{zIndex:1, textAlign:"center"}} onClick={(e)=>{backToRoom(); clearScene();}}> Play Again </Button>
          </Box>
        </>}

      </Box>
    </>
  );
};

export default PvpBattle;
