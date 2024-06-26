import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { Grid, TextField } from '@mui/material';
import { deposit, getDailyRemainSpx, sendToken } from "../../hook/hook";
import { useWeb3Context, useUserInfo, useInfo } from "../../hook/web3Context";
import { useDispatch } from "react-redux";
import { depositRequest, withdrawRequest } from "../../store/user/actions";
import { onShowAlert } from "../../store/utiles/actions";
import {
  ADMIN_WALLET_ADDRESS,
  GBAKS_SPX_RATE,
  MIN_DEPOSIT,
  MIN_WITHDRAW,
  WITHDRAW_FEE,
  WITHDRAW_LIMIT,
  WITHDRAW_LIMIT_PREMIUM,
  chainId,
  web3static
} from "../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import api from '../../utils/callApi';

interface Props {
  open: any;
  setOpen: any;
  resource: any;
  egg: any;
  onExchange: any;
  onExchangeEgg: any;
}

const DepositModal = ({ open, setOpen, resource, egg, onExchange, onExchangeEgg }: Props) => {

  const { address } = useWeb3Context();
  const [refresh, setRefresh] = useState(false);
  const userInfo = useUserInfo(refresh);
  const [availableSwap, setAvailableSwap] = useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (web3static.utils.isAddress(address)) {
  //       const res = await getDailyRemainSpx(address)
  //       setAvailableSwap(web3static.utils.fromWei(res, "gwei"));
  //     }
  //   }
  //   fetchData()
  // }, [open, address])

  const dispatch = useDispatch<any>();

  const handleClose = () => setOpen(false);

  const [spxAmount, setSPXAmount] = useState(0);
  const [gbaksAmount, setGbaksAmount] = useState(0);

  const onChangeAmount = (e: any) => {
    e.preventDefault();

    if (e.target.value < 0) return;

    setSPXAmount(e.target.value);
  };

  const onChangeEggAmount = (e: any) => {

    e.preventDefault();

    if (e.target.value < 0) return;

    setGbaksAmount(e.target.value);
  };

  const onDeposit = async () => {
    if (spxAmount < MIN_DEPOSIT) {
      alert(`minimal withdraw amount is ${MIN_DEPOSIT}SPX`);
      return;
    }
    dispatch(onShowAlert("Pease wait while confirming", "info"));
    let transaction = await deposit(address, ADMIN_WALLET_ADDRESS[chainId], spxAmount);
    dispatch(depositRequest(address, spxAmount, transaction.transactionHash, (res: any) => {
      handleClose();
      if (res.success) {
        dispatch(onShowAlert("Deposit successfully", "success"));
      } else {
        dispatch(onShowAlert("Deposit faild!", "warning"));
      }
    }));
  }

  const onWithdraw = async () => {
    if (gbaksAmount < GBAKS_SPX_RATE * MIN_WITHDRAW) {
      alert(`minimal withdraw amount is ${GBAKS_SPX_RATE * MIN_WITHDRAW}Gbaks`);
      return;
    }

    if (Number(availableSwap) * GBAKS_SPX_RATE < gbaksAmount) {
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
      walletAddress:address,
    });

    setAvailableSwap(Math.floor(res.count));
  }

  useEffect(() => {
    if(open) {
      setAvailableSwap(0);
      updateAvailableSwap();
    }
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="parent-modal-title" style={{ marginBottom: 0 }}>
            {`Deposit and Withdraw`}
          </h2>
          <p style={{ color: "#879906", display: "flex", marginTop: "4px", marginBottom: "10px" }}>
            <ErrorOutlineIcon />
            {`You can withdraw SPX: $${WITHDRAW_LIMIT} a day and $${WITHDRAW_LIMIT_PREMIUM} if you have premium`}
          </p>
          <Grid container>
            <Grid item xs={12} sm={6} md={6} sx={{ marginBottom: "10px" }}>
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
                  name="spx"
                  label="SPX"
                  value={spxAmount}
                  type="number"
                  onChange={onChangeAmount}
                />
                <p>{`You will receive ${Number(spxAmount)} Gbaks`}</p>

                <p style={{ color: "#879906", display: "flex", marginTop: "2px" }}><ErrorOutlineIcon />
                  {`Min deposit: ${MIN_DEPOSIT} SPX.`}
                </p>
                <Button variant="contained" color='primary' onClick={e => onDeposit()} >
                  {`Deposit`}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ marginBottom: "10px" }}>
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
                  name="gbaks"
                  label="Gbaks"
                  value={gbaksAmount}
                  type="number"
                  onChange={onChangeEggAmount}
                />
                <p>You will receive {Math.floor(gbaksAmount / GBAKS_SPX_RATE)} SPX</p>
                <p style={{ color: "#879906", display: "flex", marginTop: "2px" }}>
                  <ErrorOutlineIcon />
                  {`Available: ${Number(availableSwap).toFixed(1)} SPX`}
                </p>
                <Button variant="contained" color='primary' onClick={e => onWithdraw()} >
                  {`Withdraw`}
                </Button>
              </Box>
              <p style={{ color: "#879906", display: "flex", marginTop: "12px" }}>
                <ErrorOutlineIcon /> {`withdraw fee is ${WITHDRAW_FEE} BUSD`}
              </p>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default DepositModal;
