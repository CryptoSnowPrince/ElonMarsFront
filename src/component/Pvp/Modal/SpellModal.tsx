import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { useWeb3Context } from "../../../hook/web3Context";
import { useDispatch } from "react-redux";
import { depositRequest, withdrawRequest } from "../../../store/user/actions";
import { onShowAlert } from "../../../store/utiles/actions";
import { ADMIN_WALLET_ADDRESS, chainId } from "../../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props{
    open: any;
    setOpen: any;
}

const SpellModal = ({open, setOpen}:Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const dispatch = useDispatch<any>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    pt: 1,
    pb: 1
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
          <h2 id="parent-modal-title">Select Unit</h2>
        </Box>
      </Modal>
    </>
  );
};

export default SpellModal;
