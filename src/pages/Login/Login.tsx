import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./Login.module.scss";
import ExchangeModal from '../../component/Header/ExchangeModal';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import DepositModal from '../../component/Modal/DepositModal';
import { STAKE_TIMER } from '../../hook/constants';
import MiningModal from '../../component/Modal/MiningModal';
import { showMinutes } from '../../utils/timer';
import { width } from '@mui/system';
import InstructionModal from '../../component/Modal/InstructionModal';

const Login = () => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const [openInstruction, setOpenInstruction] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{

    if(connected && address) {
      navigate('/main');
    }
  }, [connected]);

  return (
    <>
      <InstructionModal open = {openInstruction} setOpen = {setOpenInstruction}/> 
      <Box
        className={styles.loginbg}
        sx={{
          position: "fixed",
          top:0,
          width:"100%",
          zIndex: 2,
        }}
      >
        <video src="/images/background.mp4" autoPlay loop muted></video>
        <Box sx={{
          position: "absolute",
          width: "100vw",
          top: "50%",
          left: "50%",
          transform:"translate(-50%, -50%)",
          justifyContent: "center",
          
          display: "flex"
        }}>
          <Box 
            className={styles.button_group}
          > 
          {/* <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>{console.log("asdfasdf")}}> Log test </Button> */}
            <Box className={styles.icon_buttons}><Button sx={{mb:1, width:"100%"}} variant="contained" color='success' onClick={(e)=>{connect()}}><img src='/images/icon_metamask.png'/>Connect Metamask</Button></Box>
            <Box className={styles.icon_buttons}><a className={styles.link} href='https://pancakeswap.finance/swap?outputCurrency=BNB&inputCurrency=0xc6D542Ab6C9372a1bBb7ef4B26528039fEE5C09B'><Button sx={{width:"100%", justifyContent:"left", mb:1}} variant="contained" color='success' ><img src='/images/icon_spx.png'/>Buy/Sell SPX</Button></a></Box>
            <Box className={styles.icon_buttons}><Button sx={{width:"100%", justifyContent:"left", mb:1}} variant="contained" color='success' onClick={(e)=>{setOpenInstruction(true)}} ><img src='/images/icon_youtube.png'/>INSTRUCTION</Button></Box>
          </Box>

        </Box>
      </Box>
    </>
  );
};

export default Login;
