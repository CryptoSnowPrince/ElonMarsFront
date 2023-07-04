import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';


import Modal from '@mui/material/Modal';
import styles from "./PvpSpell.module.scss";
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
import { changePvpStatus, getRoomList, setAbility } from "../../../store/pvp/actions";

import { spellTypes } from "../../../utils/constants.js"
import PvpUnitCard from "../UnitCard/PvpUnitCard";

import RoomCreateModal from "../Modal/RoomCreateModal";
import PvpSpellCard from "../SpellCard/PvpSpellCard";
import { PVP_STATUS } from "../../../store/pvp/constant";

const PvpSpell = () => {
    
  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom} = pvpModule;

  const { connected, chainID, address, connect } = useWeb3Context();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedSpells, setSelectedSpells] = useState([]);
  
  const onStartGame = () => {

    if(selectedSpells.length != 3) {
      alert("You have to select 3 spells");
      return;
    }

    dispatch(setAbility(pvpRoom.roomid, address, selectedSpells));
  }


  return (<>
    <Box className={styles.root}>
      <RoomCreateModal open={openCreateModal} setOpen={setOpenCreateModal}/>
      <Box>
        <h2 style={{color:"white", margin: 0}}>Select 3 Weapons</h2>
        <Button variant="contained" color='secondary' sx={{zIndex:1, marginBottom: "10px"}} onClick={onStartGame}> Start Game </Button>
      </Box>

      <Grid container>
        {spellTypes.map((item)=>(
          <Grid item xs = {6} sm = {4} md = {3} sx={{display:"flex", justifyContent:"center", mb: 1}}>
            <PvpSpellCard type = {item} selectedSpells = {selectedSpells} setSelectedSpells = {setSelectedSpells}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  </>)};

export default PvpSpell;