import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { sendToken } from "../../hook/hook";
import { useWeb3Context } from "../../hook/web3Context";
import { useDispatch, useSelector } from "react-redux";
import { buyMining, buyPremium, claimMining, requestMining } from "../../store/user/actions";
import { showMinutes } from "../../utils/timer";
import { onShowAlert } from "../../store/utiles/actions";
import { ADMIN_WALLET_ADDRESS, chainId, PREMIUM_COST, URANIUM_MINE } from "../../hook/constants";
import AlarmIcon from '@mui/icons-material/Alarm';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';


interface Props{
    open: any;
    setOpen: any;
}
  
const InstructionModal = ({open, setOpen}:Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const dispatch = useDispatch<any>();
  const userModule = useSelector((state:any) => state.userModule); 
  const {user} = userModule;


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showBuyButton, setBuyButton] = useState(true);
  const [requested, setRequested] = useState(false);
  const [uTime, setuTime] = useState(0);

  const onBuyPremium = async () => {
    
    handleClose();
    try{
      dispatch(onShowAlert("Pease wait while confirming", "info"));
      
      let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], PREMIUM_COST);
      dispatch(buyPremium(address, PREMIUM_COST, transaction.transactionHash, (res:any)=>{
        if(res.success) {
          dispatch(onShowAlert("Buy permium successfully", "success"));
        } else {
          dispatch(onShowAlert("Faild in buying premium", "warning"));
        }
      }));
    } catch(e) {
      console.log(e);
    }
  }
  

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      md: 600,
      sm: 600,
      xs: 300
    },
    // background: "url(/images/modal-back.png)",
    bgcolor: '#ffffff6e',
    border: '2px solid #fff',
    boxShadow: 24,
    borderRadius: 3,
    textAlign:"center",
    p: 2,
    pt: 1,
    fontSize: "24px",
    color:"#060036",
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <Grid container sx={{justifyContent:"center"}}>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{cursor:"pointer"}}>
                <h1 style={{fontSize: "24px"}}>инструкция на русском</h1>
                <a href="https://youtu.be/-ZHRm7PzJjY">
                  <img src="/images/instruction_1.png" style={{width: "280px"}}/>
                </a>

              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{cursor:"pointer"}}>
                <h1 style={{fontSize: "24px"}}>Instruction in English</h1>
                <a href="https://youtu.be/wjg1JzwjNPk">
                  <img src="/images/instruction_2.png" style={{width: "280px"}}/>
                </a>
              </Box>
            </Grid>
            
          </Grid>

          <h1 style={{fontSize: "24px", display:"flex", alignItems:"center"}}><img src='/images/icon_metamask.png' style={{width: "30px", marginRight: "10px"}}/>Instructions on how to use the metamask for play</h1>
        </Box>
      </Modal>
    </>
  );
};

export default InstructionModal;
