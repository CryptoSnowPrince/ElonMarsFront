import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { Box } from '@mui/material';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./NftPage.module.scss";
import BuyNftModal from '../../component/Modal/BuyNftModal';
import NftCard from './NftCard';

interface MainProps {
  showAccount: any,
  setShowAccount: any,
}

const NftPage = ({ showAccount, setShowAccount }: MainProps) => {
  const navigate = useNavigate();
  const { connected, address } = useWeb3Context();
  const [openPurchase, setOpenPurchase] = useState(-1);

  useEffect(() => {
    if (!(connected && address)) {
      navigate('/');
    }
  }, [connected, address, navigate]);

  return (
    <>
      <Box className={styles.root}>
        <Header
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />

        <BuyNftModal
          open={openPurchase}
          setOpen={setOpenPurchase}
        />

        <Box style={{ display: "flex", marginTop: "150px", alignItems: 'center', justifyContent: 'space-around' }}>
          <NftCard id={0} action={setOpenPurchase} />
          <NftCard id={1} action={setOpenPurchase} />
          <NftCard id={2} action={setOpenPurchase} />
        </Box>

      </Box>


    </>
  );
};

export default NftPage;
