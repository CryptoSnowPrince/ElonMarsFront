import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import styles from "./PvpSpellCard.module.scss";
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
import { changePvpStatus } from "../../../store/pvp/actions";
import { PVP_STATUS } from "../../../store/pvp/constant";

interface Props {
  type: string,
  selectedSpells: any,
  setSelectedSpells: any,
}


const PvpSpellCard = ({type, selectedSpells, setSelectedSpells}:Props) => {

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const [isSelected, setIsSelected] = useState(selectedSpells.includes(type));

  const onSelectUnit = () => {

    let _selectedSpells = [...selectedSpells];

    if(_selectedSpells.includes(type)) {
      let index = _selectedSpells.indexOf(type);
      _selectedSpells.splice(index, 1);
    } else {

      if(_selectedSpells.length >= 3) {
        alert("You can't select more than 3 abilities!");
        return;
      } 
      _selectedSpells.push(type);
    }

    setSelectedSpells(_selectedSpells);
  }

  useEffect(()=>{
    setIsSelected(selectedSpells.includes(type));
  }, [JSON.stringify(selectedSpells)]);

   return (
      <>
        <Box className={styles.spellcard} onClick = {onSelectUnit}>
          {isSelected && <img src={`/images/selected_label.png`} style={{position:"absolute", top: 0, left: 0, width: "100px"}}/>}
          <img src={`/images/spell/${type}.png`} />
        </Box>
      </>
  )};

export default PvpSpellCard;
