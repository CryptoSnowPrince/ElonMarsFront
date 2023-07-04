import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { useSelector } from "react-redux";

interface Props{
    open: any;
    setOpen: any;
    resource: any;
    egg: any;
    onExchange: any;
    onExchangeEgg: any;
}

const ExchangeModal = ({open, setOpen, resource, egg, onExchange, onExchangeEgg}:Props) => {

  const userModule = useSelector((state:any) => state.userModule); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [swapAmount, setSwapAmount] = useState(0);
  const [swapEggAmount, setSwapEggAmount] = useState(0);
  const [ispremium, setIsPremium] = useState(false);

  const onChangeAmount = (e:any) => {
    e.preventDefault();

    if(e.target.value < 0) return;

    setSwapAmount(e.target.value);
  };

  const onChangeEggAmount = (e:any) => {

    e.preventDefault();

    if(e.target.value < 0) return;

    setSwapEggAmount(e.target.value);
  };

  const onSwap = () => {
    if(resource < swapAmount) return;
    onExchange(swapAmount)
  }

  const onSwapEgg = () => {
    if(egg < swapEggAmount) return;
    onExchangeEgg(swapEggAmount)
  }

  useEffect(()=>{
    let date = new Date();

    let expiredTime = new Date(userModule.user.premium);
    // console.log("--->", userModule.user.premium, expiredTime, "<---");
    let curTime = new Date();
    expiredTime.setMonth( expiredTime.getMonth() + 1 );

    // console.log(expiredTime, date);

    let curSec = date.getTime() + date.getTimezoneOffset()*60*1000;
    let endSec = expiredTime.getTime();

    if(endSec > curSec) {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }

  }, [userModule.user.premium])

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs:200,
      md:400,
    },
    // background: "url(/images/modal-back.png)",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
          <h2 id="parent-modal-title">Exchange Modal</h2>
          <Grid container>
            <Grid item xs={12} sm={6} md={6} >
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                <TextField 
                  sx={{mr:1, textAlign:"right", borderColor:"red"}} 
                  name="resource" 
                  label="Resource" 
                  value={swapAmount} 
                  type = "number" 
                  onChange={onChangeAmount}
                  error={resource < swapAmount ? true : false}
                />
                <Box>
                  <p>You will receive {swapAmount * 5} Gbaks</p>
                  {ispremium && <p>Premium bonus + {Math.floor(swapAmount * 3/2)} Gbaks</p>}
                </Box>
                <Button variant="contained" color='primary' onClick={e => onSwap()} >Swap</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} >
              <Box
                sx={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap: "20px",
                }}
              >
                <TextField 
                  sx={{mr:1, textAlign:"right", borderColor:"red"}} 
                  name="egg" 
                  label="Egg" 
                  value={swapEggAmount} 
                  type = "number" 
                  onChange={onChangeEggAmount}
                  error={egg < swapEggAmount ? true : false}
                />
                <Box>
                  <p>You will receive {swapEggAmount * 30} Gbaks</p>
                  {ispremium && <p>Premium bonus + {Math.floor(swapEggAmount * 9)} Gbaks</p>}
                </Box>
                <Button variant="contained" color='primary' onClick={e => onSwapEgg()} >Swap</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ExchangeModal;
