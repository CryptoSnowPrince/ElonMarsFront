import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { ethers } from "ethers";
import {PVP_CONTRACT_ABI} from "../../../hook/abi/pvp_contract_abi";

import { Grid, TextField, Tooltip } from '@mui/material';
import { createRoomTransaction } from "../../../hook/hook";
import { useWeb3Context } from "../../../hook/web3Context";
import { useDispatch } from "react-redux";
import { depositRequest, withdrawRequest } from "../../../store/user/actions";
import { handleSpinner, onShowAlert } from "../../../store/utiles/actions";
import { ADMIN_WALLET_ADDRESS, chainId } from "../../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PVP_STATUS } from "../../../store/pvp/constant";
import { changePvpStatus, createRoom } from "../../../store/pvp/actions";
import { IS_TEST_MODE } from "../../../utils/constants";

interface Props{
    open: any;
    setOpen: any;
}

const RoomCreateModal = ({open, setOpen}:Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const dispatch = useDispatch<any>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const roomValues = [5, 10, 20, 30, 40, 50];

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs:200,
      md:400,
    },
    background: "url(/images/room-modal-bg.png)",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 1,
    pb: 1,

    h2: {
      color: "white",
      textShadow: "#000 1px 0 10px",
      textAlign: "center"
    }
  };

  const onCreateRoom = async (value: number) => {

    if(!address){
      connect();
      return;
    }

    if(window.confirm('Are you sure to create ' + value + " BUSD room?")){
      
      try{
        
        let result = true;
        dispatch(handleSpinner(true, "Creating Room ..."));

        if(!IS_TEST_MODE) {
          result = await createRoomTransaction(address, value);
        }
        
        if(result) {
          dispatch(createRoom(address, value, (res:any) => {
            if(res.success){
              dispatch(changePvpStatus(PVP_STATUS.SELECT_UNIT));
            }
            else {
            }
          }));
    
          handleClose();
        }

        dispatch(handleSpinner(false, ""));

      } catch(e) {

        dispatch(handleSpinner(false, ""));
      }
    } 
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title">Select the room price</h2>

          <Box>
            <Grid container>
              {roomValues.map((item, index)=>(
                <Grid item key = {index} md = {4} sx={{display:"flex", justifyContent:"center", mb: 1}}>
                  <Button variant="contained" color='secondary' sx={{zIndex:1}} onClick={(e)=>onCreateRoom(item)}> {item.toString()} BUSD </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RoomCreateModal;