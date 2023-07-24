import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import { Box, Grid, Button, Typography } from '@mui/material';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./NftPage.module.scss";
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import BuyNftModal from '../../component/Modal/BuyNftModal';
import { STAKE_TIMER } from '../../hook/constants';
import { showMinutes } from '../../utils/timer';
import { width } from '@mui/system';
import NftCard from './NftCard';

interface MainProps {
  showAccount: any,
  setShowAccount: any,
}

const NftPage = ({ showAccount, setShowAccount }: MainProps) => {

  const dispatch = useDispatch<any>();
  const userModule = useSelector((state: any) => state.userModule);
  const { user } = userModule;

  const gbaks = userModule.user.gbaks;
  const resource = userModule.user.resource;
  const eggs = userModule.user.eggs;

  const [openInstruction, setOpenInstruction] = useState(false);


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const TEST_MODE = false;
  const MIN_SCREEN = 1200;
  const navigate = useNavigate();
  const { connected, chainID, address, connect } = useWeb3Context();
  const [map, setMap] = useState(0);
  const [openSwap, setOpenSwap] = useState(false);
  const [openPurchase, setOpenPurchase] = useState(-1);
  const [openMining, setOpenMining] = useState(false);

  const [items, setItems] = useState([
    { item: 0, timer: 0, posx: "80px", posy: "100px", type: 1 },
    { item: 0, timer: 0, posx: "80px", posy: "250px", type: 2 },
    { item: 0, timer: 0, posx: "80px", posy: "400px", type: 1 },
    { item: 0, timer: 0, posx: "80px", posy: "550px", type: 2 },
    { item: 0, timer: 0, posx: "200px", posy: "100px", type: 1 },
    { item: 0, timer: 0, posx: "200px", posy: "250px", type: 1 },
    { item: 0, timer: 0, posx: "200px", posy: "400px", type: 1 },
    { item: 0, timer: 0, posx: "200px", posy: "550px", type: 2 }
  ]);

  const [birds, setBirds] = useState([
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 },
    { item: 0, timer: 0 }
  ]);

  const diamonds = [
    1, 2
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const showModal = (index: any) => {
    if (gbaks < 20) {
      return;
    }
    setSelectedIndex(index);
    handleOpen()
  }

  const showBirdModal = () => {
    handleBirdOpen()
  }

  const setItem = (item: any) => {

    dispatch(stakeDiamond(address, selectedIndex, item, (res: any) => {
      if (res.success == false) return;

      let _items = [...items];
      _items[selectedIndex].item = item;
      _items[selectedIndex].timer = STAKE_TIMER;
      setItems(_items);
      handleClose();
    }));
  }

  const setBirdItem = (index: any, item: any) => {

    if (gbaks < 20) return;
    dispatch(stakeBird(address, index, (res: any) => {
      if (res.success == false) return;
      let _items = [...birds];
      _items[index].item = item;
      _items[index].timer = STAKE_TIMER;
      setBirds(_items);
    }));

  }

  const onClaim = (e: any, index: number) => {
    e.stopPropagation();

    dispatch(claimDiamond(address, index, (res: any) => {
      if (res.success == false) return;
      let _items = [...items];
      _items[index].item = 0;
      _items[index].timer = 0;
      setItems(_items);
    }));
  }

  const onClaimBird = (e: any, index: number) => {
    e.stopPropagation();

    dispatch(claimBird(address, index, (res: any) => {
      if (res.success == false) return;
      let _items = [...birds];
      _items[index].item = 0;
      _items[index].timer = 0;
      setBirds(_items);
    }));
  }

  const onExchange = (swapAmount: number) => {
    dispatch(swapResources(address, swapAmount, (res: any) => { }));
    setOpenSwap(false);
  }

  const onExchangeEgg = (swapAmount: number) => {
    dispatch(swapEggs(address, swapAmount, (res: any) => { }));
    setOpenSwap(false);
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openBird, setOpenBird] = React.useState(false);
  const handleBirdOpen = () => setOpenBird(true);
  const handleBirdClose = () => setOpenBird(false);

  let timer: any = null;
  const startTimer = () => {
    if (timer == null) {
      timer = setInterval(() => {
        setItems((prevItem) => {

          let _item = [...prevItem];
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--;
            return value;
          });
          return _item;
        });

        setBirds((prevItem) => {

          let _item = [...prevItem];
          _item = _item.map((value) => {
            if (value.timer > 0) value.timer--;
            return value;
          });
          return _item;
        });
      }, 1000);
    }
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 200,
      sm: 400,
      md: 800
    },
    background: "url(/images/modal-back.png)",
    backgroundSize: "100%",
    bgcolor: 'background.paper',
    border: '1px solid #000',
    maxHeight: "500px",
    overflow: "auto",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {

    startTimer();

    return () => clearInterval(timer);
  }, [JSON.stringify(items)]);


  // set staked diamond
  useEffect(() => {
    if (user.stakedDiamond && user.stakedDiamond.length > 0) {

      let _items = [...items];
      for (let dt of user.stakedDiamond) {
        if (!dt || dt.position > 7) continue;

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        let eDate = new Date(dt.staked_at);

        _items[dt.position].item = dt.diamond;
        _items[dt.position].timer = STAKE_TIMER - Math.floor((curSec - endSec) / 1000);
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0;
      }
      setItems(_items);
    }
  }, [JSON.stringify(user.stakedDiamond)]);

  useEffect(() => {
    if (user.stakedBirds && user.stakedBirds.length > 0) {

      let _items = [...birds];
      for (let dt of user.stakedBirds) {
        if (!dt) continue;
        if (dt.position >= 10) continue;

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        _items[dt.position].item = 1;
        _items[dt.position].timer = STAKE_TIMER - Math.floor((curSec - endSec) / 1000);
        if (_items[dt.position].timer < 0) _items[dt.position].timer = 0;
      }
      setBirds(_items);
    }
  }, [JSON.stringify(user.stakedBirds)])

  useEffect(() => {
    if (!(connected && address)) {
      navigate('/');
    }
  }, [connected]);

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
