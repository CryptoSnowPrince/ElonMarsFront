import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { deposit, sendToken } from "../../hook/hook";
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
  
const PreniumModal = ({open, setOpen}:Props) => {

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
              Premium
          </h2>

          <Box sx={{width:"200px", margin:"auto", backgroundColor: "white", borderRadius: "30px", padding:"25px"}}>
            <img src='/images/premium.png'/>
          </Box>

          <Box sx={{margin:"12px 0"}}>
            <p style={{display: "flex", justifyContent: "left", fontWeight: "700", width:"190px", margin:"auto", whiteSpace: "nowrap"}}> <RocketLaunchIcon/> Swap: Eggs, Res + 30%</p>
            <p style={{display: "flex", justifyContent: "left", fontWeight: "700", width:"190px", margin:"auto", whiteSpace: "nowrap"}}> <AlarmIcon/> Time: 30 Days</p>
          </Box>
          <Grid container sx={{justifyContent:"center"}}>
            <Grid item sm={12} >
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                <Button variant="contained" color='primary' onClick={e => onBuyPremium()} >Buy for {PREMIUM_COST} BUSD</Button>
               
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default PreniumModal;
