import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { useDispatch, useSelector } from 'react-redux';

import Header from '../../component/Header/Header';
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useWeb3Context } from '../../hook/web3Context';
import styles from "./Map2.module.scss";
import { height } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Area from '../../component/Area/Area';
import BUSD_ABI from '../../utils/busd_abi.json';
import { deposit, sendToken } from '../../hook/hook';
import { buyMap } from '../../store/user/actions';
import { ADMIN_WALLET_ADDRESS, chainId, LAND_COST } from '../../hook/constants';
import { onShowAlert } from '../../store/utiles/actions';

interface MainProps{
  showAccount: any,
  setShowAccount: any,
}

const Map2 = ({showAccount, setShowAccount}:MainProps) => {

  const dispatch = useDispatch<any>();
  const userModule = useSelector((state:any) => state.userModule); 

  const gbaks = userModule.user.gbaks;
  const resource = userModule.user.resource;
  const eggs = userModule.user.eggs;

  const navigate = useNavigate();
  

  const { connected, chainID, address, connect } = useWeb3Context();
  
  const [map, setMap] = useState([
    true, 
    false, 
    false, 
    false
  ]);

  useEffect(()=>{
    let _map = [...map];
    for (let item of userModule.user.opendPlace) {
      _map[item] = true;
    }
    setMap(_map);
  }, [JSON.stringify(userModule.user.opendPlace)]);

  const defaultItems = [
    {item:0, timer:0, posx:"200px", posy:"200px", type: 3, width: "100px"},
  ];

  const [items, setItems] = useState(defaultItems);

  const defaultItems2 = [
    {item:0, timer:0, posx:"200px", posy:"100px", type: 0, width: "120px"},
    {item:0, timer:0, posx:"330px", posy:"120px", type: 0, width: "120px"},
    {item:0, timer:0, posx:"240px", posy:"230px", type: 0, width: "120px"},
  ];

  const [items2, setItems2] = useState(defaultItems2);

  const defaultItems3 = [
    {item:0, timer:0, posx:"20px", posy:"50px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"140px", posy:"50px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"260px", posy:"50px", type: 3, width: "100px"},
    {item:0, timer:0, posx:"380px", posy:"50px", type: 3, width: "100px"},

    {item:0, timer:0, posx:"20px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"140px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"260px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"380px", posy:"250px", type: 3, width: "100px"},
  ];

  const [items3, setItems3] = useState(defaultItems3);

  const defaultItems4 = [
    {item:0, timer:0, posx:"50px", posy:"50px", type: 0, width: "100px"},
    {item:0, timer:0, posx:"500px", posy:"50px", type: 0, width: "100px"},
    
    {item:0, timer:0, posx:"50px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"200px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"350px", posy:"250px", type: 1, width: "100px"},
    {item:0, timer:0, posx:"500px", posy:"250px", type: 1, width: "100px"},
  ];

  const [items4, setItems4] = useState(defaultItems4);

  const onBuyMap = async (area:any) => {

    try{
      dispatch(onShowAlert("Pease wait while confirming", "info"));

      let transaction = await deposit(address, ADMIN_WALLET_ADDRESS[chainId], LAND_COST[area-1]);
      dispatch(buyMap(address, LAND_COST[area-1], transaction.transactionHash, area, (res:any)=>{
        if(res.success) {
          let _map = [...map];
          _map[area] = true;
          setMap(_map);
          dispatch(onShowAlert("Buy map successfully", "success"));
        } else {
          dispatch(onShowAlert("Faild in buying map", "warning"));
        }
      }));
    } catch(e){
      console.log(e);
    }

  }

  return (
    <>
      
      <Box
        sx={{
          position:"absolute", 
          top:0,
          left:0,
          width:"100%",
          maxHeight:"calc(100vh-72px)",
        }}
        
      >
        <img style={{height:"90vh"}}src='/images/stone.png' />
      </Box>

      <Box sx={{
        top: "50%",
        left: 0,
        zIndex: 10,
        position:"absolute",
        cursor:"pointer",
      }}
        onClick={(e:any)=>{

          navigate("/main");
        }}
      >
        <img src="/images/btn_arraw.png" className={styles.arraw}/>
      </Box>

      <Box
        sx={{
          pointerEvents: `${connected?"":"none"}`,
          // position: "absolute"
          height: "100%"
        }}
      >
        <Box
          sx={{display:"flex", height: "50%"}}
        >
          <Area
            gbaks={gbaks} 
            resource={resource} 
            eggs={eggs} 
            position = {0}
            mapStatus = {map[0]}
            items = {items}
            defaultItems = {defaultItems}
            setItems={setItems}
            onBuyMap = {onBuyMap}
            showAccount={showAccount}
            setShowAccount={setShowAccount}
          />
          <Area
            gbaks={gbaks} 
            resource={resource} 
            eggs={eggs} 
            position = {1}
            mapStatus = {map[1]}
            items = {items2}
            defaultItems = {defaultItems2}
            setItems={setItems2}
            onBuyMap = {onBuyMap}
            showAccount={showAccount}
            setShowAccount={setShowAccount}
          />
        </Box>

        <Box
          sx={{display:"flex", height: "50%"}}
        >
          <Area
            gbaks={gbaks} 
            resource={resource} 
            eggs={eggs} 
            position = {2}
            mapStatus = {map[2]}
            items = {items3}
            defaultItems = {defaultItems3}
            setItems={setItems3}
            onBuyMap = {onBuyMap}
            showAccount={showAccount}
            setShowAccount={setShowAccount}
          />

          <Area
            gbaks={gbaks} 
            resource={resource} 
            eggs={eggs} 
            position = {3}
            mapStatus = {map[3]}
            items = {items4}
            defaultItems = {defaultItems4}
            setItems={setItems4}
            onBuyMap = {onBuyMap}
            showAccount={showAccount}
            setShowAccount={setShowAccount}
          />
          
          
        </Box>

      </Box>
    </>
  );
};

export default Map2;
