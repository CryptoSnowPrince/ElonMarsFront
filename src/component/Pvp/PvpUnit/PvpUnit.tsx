import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';


import Modal from '@mui/material/Modal';
import styles from "./PvpUnit.module.scss";
import Header from "../../Header/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWeb3Context } from '../../../hook/web3Context';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST, STAKE_TIMER } from "../../../hook/constants";
import { showMinutes } from "../../../utils/timer";
import GoldMineModal from "../../Modal/GoldMineModal";
import UraniumMineModal from "../../Modal/UraniumMineModal";
import PowerPlantModal from "../../Modal/PowerPlantModal";
import PvpRoomCard from "../PvpRoomCard/PvpRoomCard";
import { getRoomList } from "../../../store/pvp/actions";

import { unitTypes } from "../../../utils/constants.js"
import PvpUnitCard from "../UnitCard/PvpUnitCard";

import RoomCreateModal from "../Modal/RoomCreateModal";

const PvpUnit = () => {
    
  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 

  const { connected, chainID, address, connect } = useWeb3Context();

  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (<>
    <Box className={styles.root}>
      <RoomCreateModal open={openCreateModal} setOpen={setOpenCreateModal}/>
      <Box>
        <h2 style={{color:"white"}}>Select the Unit</h2>
      </Box>
      <Grid container>
        {unitTypes.map((item)=>(
          <Grid item md = {4} sx={{display:"flex", justifyContent:"center", mb: 1}}>
            <PvpUnitCard type = {item}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  </>)};

export default PvpUnit;