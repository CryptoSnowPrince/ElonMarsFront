import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField, Tooltip } from '@mui/material';
import { deposit, sendToken } from "../../hook/hook";
import { useWeb3Context } from "../../hook/web3Context";
import { useDispatch } from "react-redux";
import { depositRequest, withdrawRequest } from "../../store/user/actions";
import { onShowAlert } from "../../store/utiles/actions";
import { ADMIN_WALLET_ADDRESS, chainId } from "../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import api from '../../utils/callApi';

interface Props {
  open: any;
  setOpen: any;
}

const BuyNftModal = ({ open, setOpen }: Props) => {

  const { connected, chainID, address, connect } = useWeb3Context();
  const [availableSwap, setAvailableSwap] = useState(0);

  const dispatch = useDispatch<any>();

  const handleClose = () => setOpen(-1);

  const [nftAmount, setNftAmount] = useState(0);
  const [gbaksAmount, setGbaksAmount] = useState(0);

  const onChangeAmount = (e: any) => {
    e.preventDefault();

    if (e.target.value < 0) return;


    setNftAmount(e.target.value);
  };

  const onChangeEggAmount = (e: any) => {

    e.preventDefault();

    if (e.target.value < 0) return;

    setGbaksAmount(e.target.value);
  };

  const onDeposit = async () => {

    if (nftAmount < 320) {
      alert("minimal withdraw amount is 320SPX");
      return;
    }
    dispatch(onShowAlert("Pease wait while confirming", "info"));
    let transaction = await deposit(address, ADMIN_WALLET_ADDRESS[chainId], nftAmount);
    dispatch(depositRequest(address, nftAmount, transaction.transactionHash, (res: any) => {
      handleClose();
      if (res.success) {
        dispatch(onShowAlert("Deposit successfully", "success"));
      } else {
        dispatch(onShowAlert("Deposit faild!", "warning"));
      }
    }));
  }

  const onWithdraw = async () => {

    if (gbaksAmount < 300) {
      alert("minimal withdraw amount is 300Gbaks");
      return;
    }

    if (availableSwap * 10 < gbaksAmount) {
      alert("Swap amount is overflow the daily limit!");
      return;
    }

    dispatch(onShowAlert("Pease wait while confirming", "info"));
    let transaction = await sendToken(address, ADMIN_WALLET_ADDRESS[chainId], 1);
    dispatch(withdrawRequest(address, gbaksAmount, transaction.transactionHash, (res: any) => {
      handleClose();
      if (res.success) {
        dispatch(onShowAlert("Withdraw successfully", "success"));
      } else {
        dispatch(onShowAlert(res.message, "warning"));
      }
    }));
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 200,
      md: 400,
    },
    // background: "url(/images/modal-back.png)",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pt: 1,
    pb: 1
  };

  const updateAvailableSwap = async () => {
    let res = await api(`user/withdraw-limit`, "post", {
      walletAddress: address,
    });

    setAvailableSwap(Math.floor(res.count));
  }

  useEffect(() => {
    if (open < 0) {
      setAvailableSwap(0);
      updateAvailableSwap();
    }
  }, [open]);

  return (
    <>
      <Modal
        open={open >= 0}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title" style={{ marginBottom: 0, textAlign: 'center' }}>Purchase NFTs</h2>
          <p style={{ color: "#879906", display: "flex", marginTop: "4px", marginBottom: "10px" }}>
            <ErrorOutlineIcon />
            You can purchase 3 common nfts as maximum
          </p>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <TextField
              sx={{ mr: 1, textAlign: "right", borderColor: "red" }}
              name="amount"
              label="Amount"
              value={nftAmount}
              type="number"
              onChange={onChangeAmount}
            />
            <p>BUSD amount to spend: {Number(nftAmount)} BUSD</p>

            <Button variant="contained" color='primary' onClick={e => onDeposit()} >Purchase</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BuyNftModal;
