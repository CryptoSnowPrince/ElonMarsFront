import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { TextField } from '@mui/material';
import { useWeb3Context } from "../../hook/web3Context";
import { useDispatch } from "react-redux";
import { onShowAlert } from "../../store/utiles/actions";
import { BUSD_CONTRACT_ADDRESS, NFT_ADMIN_ADDRESS, NFT_CONTRACT_ADDRESS, RPC_URL, chainId } from "../../hook/constants";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NFT_ABI from "../../constants/abis/nft.json"
import BUSD_ABI from "../../constants/abis/erc20.json"

const config = {
  price: [30, 60, 90],
}

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL[chainId]));

const BuyNftModal = ({ open, setOpen }) => {
  const { connected, chainID, address } = useWeb3Context();

  const dispatch = useDispatch();

  const handleClose = () => setOpen(-1);

  const [nftAmount, setNftAmount] = useState(0);
  const [userData, setUserData] = useState({
    busdBalance: 0,
    nftBalance: 0,
    busdAllowance: 0
  });
  const [refresh, setRefresh] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const onChangeAmount = (e) => {
    e.preventDefault();

    if (e.target.value < 0) return;

    setNftAmount(e.target.value);
  };

  const onPurchaseNft = async () => {
    if (connected && chainID && address && open >= 0 && !pendingTx) {
      if (needApprove()) {
        alert(`Please enable to mint!`, "info");
        return;
      }

      if (userData.busdBalance < Number(nftAmount) * config.price[open]) {
        alert(`Insufficient BUSD Balance`, "info");
        return;
      }

      setPendingTx(true)
      try {
        const web3 = new Web3(window.ethereum);
        var nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS[chainID]);

        dispatch(onShowAlert("Pease wait while confirming", "info"));
        const transaction = await nftContract.methods.mint(Number(nftAmount), open).send({
          from: address
        });

        if (transaction) {
          dispatch(onShowAlert("Mint successfully", "success"));
          setPendingTx(false)
          setRefresh(!refresh)
          handleClose();
        }
      } catch (error) {
        console.log("onPurchaseNft err", error)
        dispatch(onShowAlert("Mint faild!", "warning"));
      }

      setPendingTx(false)
    } else if (pendingTx) {
      alert('pending... please wait')
    } else {
      alert('please connect wallet')
    }
  }

  const onEnable = async () => {
    if (connected && chainID && address && open >= 0 && !pendingTx) {
      setPendingTx(true)
      try {
        const web3 = new Web3(window.ethereum);
        var tokenContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainID]);

        dispatch(onShowAlert("Pease wait while confirming", "info"));
        let transaction = await tokenContract.methods.approve(NFT_CONTRACT_ADDRESS[chainID], '10000000000000000000').send({
          from: address
        });

        if (transaction) {
          dispatch(onShowAlert("Successfully Enabled", "success"));
          setRefresh(!refresh)
        }
      } catch (error) {
        console.log("approve err", error)
        dispatch(onShowAlert("Enable Fail!", "warning"));
      }
      setPendingTx(false)
    } else if (pendingTx) {
      alert('pending... please wait')
    } else {
      alert('please connect wallet')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log('buyNftModal 0: ', connected, chainID, address, open)
      if (connected && chainID && address && open >= 0) {
        try {
          console.log('buyNftModal 1: ', connected, chainID, address, open)
          const tokenContract = new web3.eth.Contract(BUSD_ABI, BUSD_CONTRACT_ADDRESS[chainID])
          const nftContract = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS[chainID])
          const busdBalanceRaw = await tokenContract.methods.balanceOf(address).call();
          const nftBalance0 = await nftContract.methods.balanceOf(address, 0).call();
          const nftBalance1 = await nftContract.methods.balanceOf(address, 1).call();
          const nftBalance2 = await nftContract.methods.balanceOf(address, 2).call();
          const busdAllowanceRaw = await tokenContract.methods.allowance(address, NFT_CONTRACT_ADDRESS[chainID]).call();
          const busdAllowance = web3.utils.fromWei(busdAllowanceRaw.toString(), 'ether');
          const busdBalance = web3.utils.fromWei(busdBalanceRaw.toString(), 'ether');
          setUserData({
            busdBalance: busdBalance,
            nftBalance: (Number(nftBalance0) + Number(nftBalance1) + Number(nftBalance2)),
            busdAllowance: busdAllowance
          })
        } catch (error) {
          console.log('buyNftModal err', error)
        }
      }
    }
    fetchData()
  }, [connected, chainID, address, open, refresh])

  const style = {
    position: 'absolute',
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

  const needApprove = () => {
    if (connected && chainID && address && open >= 0) {
      if (address.toString().toLowerCase() === NFT_ADMIN_ADDRESS[chainID].toString().toLowerCase()) {
        return false;
      }
      const busdAmount = Number(nftAmount) * config.price[open];
      if (busdAmount > userData.busdAllowance) {
        return true;
      }
      return false;
    }
    return false
  }

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
            <p>BUSD amount to spend: {Number(nftAmount) * config.price[open]} BUSD</p>

            <Button variant="contained" color='primary'
              onClick={e => {
                if (needApprove()) {
                  onEnable()
                } else {
                  onPurchaseNft()
                }
              }} >
              {needApprove() ? 'Enable' : 'Mint'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BuyNftModal;
