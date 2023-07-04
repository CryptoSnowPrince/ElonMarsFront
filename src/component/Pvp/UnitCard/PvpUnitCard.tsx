import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import styles from "./PvpUnitCard.module.scss";
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
import { changePvpStatus, setUnit } from "../../../store/pvp/actions";
import { PVP_STATUS } from "../../../store/pvp/constant";

interface Props {
  type: string
}


const PvpUnitCard = ({type}:Props) => {

  const {address} = useWeb3Context();
  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom} = pvpModule;

  const onSelectUnit = () => {

    setUnit(pvpRoom.roomid, address, type);
    dispatch(changePvpStatus(PVP_STATUS.SELECT_SPELL));
  }

   return (
      <>
        <Box className={styles.unitcard} onClick = {onSelectUnit}>
          <img src={`/images/unit/${type}-card.png`} />
        </Box>
      </>
  )};

export default PvpUnitCard;
