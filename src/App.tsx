import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/Main/Main';

import {Web3ContextProvider} from "./hook/web3Context";
import Map2 from './pages/Map2/Map2';
import Header from './component/Header/Header';
import { connect, useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { handleAlert } from './store/utiles/actions';
import PvpPage from './pages/Pvp/PvpPage';
import PvpRoom from './component/Pvp/PvpRoom/PvpRoom';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Login from './pages/Login/Login';
import NftPage from './pages/Nft/NftPage';


function App() {

  const [showAccount, setShowAccount] = useState(true);

  const dispatch = useDispatch<any>();
  const utilesModule = useSelector((state:any) => state.utilesModule);
  
  const msg = utilesModule.alert;
  const spinner = utilesModule.spinner;
  const handleClose = () => {
    dispatch(handleAlert());
  }

  return (
    <Web3ContextProvider> 

      <div className="App">
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/main" element={<Main showAccount={showAccount} setShowAccount={setShowAccount}/>} />
              <Route path="/map2" element={<Map2 showAccount={showAccount} setShowAccount={setShowAccount}/>} />
              <Route path="/pvp" element={<PvpPage showAccount={showAccount} setShowAccount={setShowAccount}/>} />
              <Route path="/nft" element={<NftPage showAccount={showAccount} setShowAccount={setShowAccount}/>} />
            </Routes>
        </BrowserRouter>
      </div>

      <Snackbar open={msg.show} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={msg.type} sx={{ width: '100%' }}>
          {msg.content}
        </Alert>
      </Snackbar>

      {spinner.show && <Box sx={{ display: 'flex', position: 'absolute', top: 0, backgroundColor:"#000000e0", width: "100%", height: "100%", zIndex:1000000 }}>
        <Box sx={{
          position: 'absolute', 
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
          // top: "calc(50% - 50px)", 
          // left: "calc(50% - 50px)"
        }}>
          <CircularProgress size={100} sx={{textAlign:"center", marginLeft: "50px"}}/>
          <h2 style={{color: "white"}}>{spinner.content}</h2>
        </Box>
      </Box>}
    </Web3ContextProvider>
  );
}

export default App;
