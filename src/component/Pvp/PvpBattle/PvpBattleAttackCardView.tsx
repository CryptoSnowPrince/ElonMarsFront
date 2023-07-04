import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';

import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hook/web3Context.js";
import PvpBattleAttackCard from "./PvpBattleAttackCard";
import styles from "./PvpBattle.module.scss";

interface Props{
  isLocal: boolean
}

const PvpBattleAttackCardView = ({isLocal}:Props) => {

  const dispatch = useDispatch<any>();
  const pvpModule = useSelector((state:any) => state.pvpModule); 
  const {pvpRoom} = pvpModule;

  const [spellTypes, setSpellTypes] = useState(["laser"]);

  useEffect(()=>{

    if(isLocal) 
      setSpellTypes(pvpRoom.localPlayer.ability);
    else 
      setSpellTypes(pvpRoom.remotePlayer.ability);

  }, [isLocal, JSON.stringify(pvpRoom.localPlayer.ability), JSON.stringify(pvpRoom.remotePlayer.ability)]);

  return (<>
    <Box className={styles.cardview}>
      <Grid container>
        {spellTypes.map((item)=>(
          <Grid item xs = {4} sm = {4} md = {4} sx={{display:"flex", justifyContent:"center", mb: 1}}>
            <PvpBattleAttackCard type = {item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </>)};

export default PvpBattleAttackCardView;