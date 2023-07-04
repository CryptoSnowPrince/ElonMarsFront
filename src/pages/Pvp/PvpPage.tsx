import React, { useState, useEffect, useRef } from 'react';
import '../../PhaserGame';

import Header from '../../component/Header/Header';
import { Box, ToggleButtonGroup, ToggleButton, TableContainer, Table, TableHead, TableRow, TableBody, Button} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useWeb3Context } from '../../hook/web3Context';
import { getExperience } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';

import PvpRoom from '../../component/Pvp/PvpRoom/PvpRoom';
import { PVP_STATUS } from '../../store/pvp/constant';
import PvpUnit from '../../component/Pvp/PvpUnit/PvpUnit';
import PvpSpell from '../../component/Pvp/PvpSpell/PvpSpell';
import PvpBattle from '../../component/Pvp/PvpBattle/PvpBattle';

import socket from '../../utils/socket';
import { attackSuccess, battleFinished, changeRoomStatus, createRoom, createRoomSuccess, enterRoom, enterRoomSuccess, getBattleDataSuccess, playerReadySuccess, setAbilitySuccess, setMyAddress, setUnitSuccess, unitAttackSuccess, updateBonusDamage } from '../../store/pvp/actions';
import { PLAYER_SOCKET, ROOM_SOCKET, UNIT_SOCKET } from '../../utils/socket_api';
import { decryptData } from '../../utils/socketHelper';
import useMediaQuery from '@mui/material/useMediaQuery';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { shortAddress } from '../../utils/tools';
import {loadScene} from "../../PhaserGame";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "white",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: "#2e7d32",
  color: "white",
  '&.Mui-selected': {
    backgroundColor: "#113713",
    color: "white",
  },
  '&.Mui-selected:hover': {
    backgroundColor: "#399b3f",
    color: "white",
  },
  '&:hover': {
    backgroundColor: "#1c5d20",
    color: "white",
  }
}));

interface PvpPageProps{
  showAccount: any,
  setShowAccount: any,
}

const PvpPage = ({showAccount, setShowAccount}:PvpPageProps) => {
  
  const isMobile = useMediaQuery('(max-width:900px)');

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const userModule = useSelector((state:any) => state.userModule); 
  const {roomDetail, pvpRoom} = pvpModule;
  const {users, ranking, score} = userModule.leaderboard;
  const {address} = useWeb3Context();

  useEffect(()=>{
    socket.emit("connection", () => {
      
    });

    // ----------------------------------- Player socket events -----------------------------------
    socket.on(PLAYER_SOCKET.CREATE_ROOM, (data:any) =>{
      data = decryptData(data);
      dispatch(createRoomSuccess(data.roomid, data.price));
    })

    socket.on(PLAYER_SOCKET.JOIN_ROOM, (data:any) =>{
      data = decryptData(data);
      dispatch(enterRoomSuccess(data.roomid, data.address, data.price, data.turn));
    })

    socket.on(PLAYER_SOCKET.SELECT_UNIT, (data:any) =>{
      data = decryptData(data);
      console.log(data);
      dispatch(setUnitSuccess(data.roomid, data.address, data.unit));
    })

    socket.on(PLAYER_SOCKET.SELECT_ABILITY, (data:any) =>{
      data = decryptData(data);
      dispatch(setAbilitySuccess(data.roomid, data.address, data.ability));
    })

    socket.on(PLAYER_SOCKET.ATTACK, (data:any) =>{
      data = decryptData(data);
      dispatch(attackSuccess(data.roomid, data.address, data.type, data.damage, data.health));
    })

    socket.on(PLAYER_SOCKET.FINISHED, (data:any) =>{
      data = decryptData(data);
      dispatch(battleFinished(data.winner));
    })

    socket.on(PLAYER_SOCKET.READY, (data:any) =>{
      data = decryptData(data);
      dispatch(playerReadySuccess(data.roomid));
    })

    socket.on(UNIT_SOCKET.ATTACK, (data:any) =>{
      data = decryptData(data);
      console.log("player socket attack = ", data);
      dispatch(unitAttackSuccess(pvpRoom.roomid, data.address, data.type, data.damage, data.health));
    })

    socket.on(PLAYER_SOCKET.UPDATE_BONUS_DAMAGE, (data:any) =>{
      data = decryptData(data);
      dispatch(updateBonusDamage(pvpRoom.roomid, data.localDamage, data.remoteDamage));
    })

    socket.on("getBattleData", (data:any) =>{
      data = decryptData(data);
      console.log("Received Get Battle Data", data);
      dispatch(getBattleDataSuccess(data));
    })

    socket.on(ROOM_SOCKET.ROOM_STATUS, (data:any) => {
      data = decryptData(data);
      dispatch(changeRoomStatus(data.roomid, data.status));
    })

    
    loadScene();

  }, []);

  useEffect(()=>{
    if(address && address!= "") {
      dispatch(getExperience(address));
      dispatch(setMyAddress(address));
    }
  }, [address]);

  const [tab, setTab] = React.useState('battle');

  const handleChangeTab = (newTab: string) => {
    setTab(newTab);
  };

  return (
    <Box sx={{width: window.innerWidth}}>
     
      <div id='phaser-container' style={{
        zIndex: 0, 
        position: "absolute", 
        display: [PVP_STATUS.WAITING, PVP_STATUS.PLAY, PVP_STATUS.END].includes(roomDetail.status) ? "block" : "none"
      }}> </div>
      {/* {[PVP_STATUS.WAITING, PVP_STATUS.PLAY, PVP_STATUS.END].includes(roomDetail.status) && <div id='phaser-container' style={{zIndex: 0, position: "absolute"}}> </div>} */}
      {roomDetail.status == PVP_STATUS.SELECT_ROOM && <Box sx={{position:"absolute", top: 0}}>
        <Header 
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />
      </Box>}

      {roomDetail.status == PVP_STATUS.SELECT_ROOM && <>
        <Box
          sx={{mt: "80px", pl: "20px"}}
        >
          <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>{handleChangeTab("battle")}}> Battle </Button>
          <Button variant="contained" color='warning' sx={{zIndex:1, ml: 2}} onClick={(e)=>{handleChangeTab("leaderboard")}}> 
            Leaderboard
            <img style= {{
              position: "absolute",
              top: "-12px",
              right: "-12px",
              width: "30px"
            }}src='/images/kubok.png'/>
          </Button>
        </Box>
      </>}


      {tab == "battle" ? <>
      {roomDetail.status == PVP_STATUS.SELECT_ROOM && <PvpRoom/>}
      {roomDetail.status == PVP_STATUS.SELECT_UNIT && <PvpUnit/>}
      {roomDetail.status == PVP_STATUS.SELECT_SPELL && <PvpSpell/>}
      {[PVP_STATUS.WAITING, PVP_STATUS.PLAY, PVP_STATUS.END].includes(roomDetail.status) && <PvpBattle/>}
      {/* {(roomDetail.status == PVP_STATUS.WAITING || roomDetail.status == PVP_STATUS.PLAY || roomDetail.status == PVP_STATUS.END) && <PvpBattle/>} */}
      {/* {roomDetail.status == PVP_STATUS.END && <PvpBattle/>} */}
      </> : 
      <>
        {(address != "" && address) ? <Box sx={{fontSize:"20px", m: 4}}>
          <Box sx={{display:"flex"}}>
            <Box sx={{width: "30px"}}>
              <img src='/images/kubok.png' />
            </Box>
            <Box sx={{color:"yellow", fontWeight: 700, ml: 2}}>
              Your ranking is {ranking} (Score: {score})
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{bgcolor:"#0000009e"}}>
            <Table sx={{ minWidth: 300 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell> Ranking </StyledTableCell>
                  <StyledTableCell >Wallet</StyledTableCell>
                  <StyledTableCell >Score</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {users.map((row:any, index: number) => (
                  <StyledTableRow key={row.index}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell >{isMobile ? shortAddress(row.walletAddress) : row.walletAddress}</StyledTableCell>
                    <StyledTableCell >{row.exp}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>:
        <Box sx={{fontSize:"20px", m: 4}}>
          <h3>Please connect wallet</h3>
        </Box>
        }
      </>
      }

    </Box>
  );
};
 
export default PvpPage;
