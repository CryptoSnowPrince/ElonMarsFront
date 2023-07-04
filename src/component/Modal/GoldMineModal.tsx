import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { deposit, sendToken } from "../../hook/hook";
import { useWeb3Context } from "../../hook/web3Context";
import { useDispatch, useSelector } from "react-redux";
import { buyMining, claimMining, requestMining } from "../../store/user/actions";
import { ADMIN_WALLET_ADDRESS, chainId, GOLD_MINE } from "../../hook/constants";
import { showMinutes } from "../../utils/timer";
import { onShowAlert } from "../../store/utiles/actions";
import AlarmIcon from '@mui/icons-material/Alarm';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

interface Props{
    open: any;
    setOpen: any;
}
  
const GoldMineModal = ({open, setOpen}:Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const dispatch = useDispatch<any>();
  const userModule = useSelector((state:any) => state.userModule); 
  const {user} = userModule;


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showBuyButton, setBuyButton] = useState(true);
  const [requested, setRequested] = useState(false);
  const [uTime, setuTime] = useState(0);

  const onBuyMining = async () => {
    
    dispatch(onShowAlert("Pease wait while confirming", "info"));
    
    let transaction = await deposit(address, ADMIN_WALLET_ADDRESS[chainId], GOLD_MINE.COST.toString());
    dispatch(buyMining(address, GOLD_MINE.COST, transaction.transactionHash, "gold", (res:any)=>{
      handleClose();
      if(res.success) {
        dispatch(onShowAlert("Buy mining module successfully", "success"));
      } else {
        dispatch(onShowAlert("Faild in buying mining module", "warning"));
      }
      
    }));
  }

  
  const onClaimMining = async () => {
    dispatch(claimMining(address, "gold", (res:any)=>{handleClose()}));
  }

  const onRequestMining = async () => {
    dispatch(requestMining(address, "gold", (res:any)=>{handleClose()}));
  }

  let timer:any = null;
  const startTimer = () => {
    if (timer == null) {
      timer = setInterval(()=>{
        setuTime((prevTimer)=>{
          if(prevTimer <= 1) {
            clearInterval(timer);
            timer = null;
            return 0;
          }
          return prevTimer-1;
        });
      }, 1000);
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    // background: "url(/images/modal-back.png)",
    bgcolor: '#d5cbcb',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 3,
    textAlign:"center",
    p: 2,
    pt: 1
  };

  useEffect(()=>{
    if(user.goldMine) {
      const check = new Date('2022-12-30T00:00:00').getTime();
      const miningModule = new Date(user.goldMine).getTime();


      let date = new Date();
      let curSec = date.getTime();

      let tm = GOLD_MINE.TIMER - Math.floor((curSec - miningModule)/1000);
      if(tm<0) {
        setuTime(0);
      } else {
        setuTime(tm);
        startTimer();
      }

      if(check > miningModule) {
        setBuyButton(true);
      } else {
        setBuyButton(false);
      }
    }

    if(user.goldMineRequest == 1) {
      setRequested(true)
    } else {
      setRequested(false);
    }
    
  }, [JSON.stringify(user.goldMine), user.goldMineRequest]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title" style={{
              textAlign:"center", 
              backgroundColor:"white", 
              borderRadius:100,
              display:"inline-block" ,
              padding: "4px 12px"}}
            >
                Gold Mine
            </h2>

          <Box sx={{width:"200px", margin:"auto", backgroundColor: "white", borderRadius: "30px", padding:"25px"}}>
            <img src='/images/mine2.png'/>
          </Box>

          <Box sx={{margin:"12px 0"}}>
            <p style={{display: "flex", justifyContent: "left", fontWeight: "700", width:"150px", margin:"auto"}}> <AllInclusiveIcon/> Earn: 300Gbaks</p>
            <p style={{display: "flex", justifyContent: "left", fontWeight: "700", width:"150px", margin:"auto"}}> <AlarmIcon/> Time: 3Hours</p>
          </Box>

          <Grid container sx={{justifyContent:"center"}}>
            <Grid sm={12} >
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                {showBuyButton && <Button variant="contained" color='primary' onClick={e => onBuyMining()} >Buy for {GOLD_MINE.COST} SPX</Button>}
                {!showBuyButton && <>
                
                  {requested ? (<>
                    {uTime != 0 && <Box>
                        {showMinutes(uTime)}
                      </Box>}
                    {uTime == 0 && <Button variant="contained" color='primary' onClick={e => onClaimMining()} >Claim</Button>}
                  </>) : (
                    <>
                      <Button variant="contained" color='primary' onClick={e => onRequestMining()} >{GOLD_MINE.REQUEST} Gbaks</Button>
                    </>
                  )}
                </> }
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default GoldMineModal;
