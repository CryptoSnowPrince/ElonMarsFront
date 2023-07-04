import React, { useState } from "react";
import styles from "./NetworkItem.module.scss";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';

import { changeNetwork } from "../../hook/hook";
import { chainData } from "../../hook/data";

import { IconButton, Snackbar } from "@mui/material";

interface Props{
  chainid: number;
  url: string;
  setChain: any;
  isfavourite: boolean;
  onAddFavourite : any;
}

const NetworkItem = ({chainid, url, isfavourite, setChain, onAddFavourite}:Props) => {

  const onClick = (e:any) => {
    setChain(chainid);
  }

  const addFavourite = (e:any) => {
    e.preventDefault();
    if(e && e.stopPropagation) e.stopPropagation(); 
    onAddFavourite(chainid);
  }

  const [showRPC, setShowRPC] = useState(false);
  const [chainId, setChainId] = useState(chainid);

  const onShowRPC = (e:any) =>{
    e.preventDefault();
    if(e && e.stopPropagation) e.stopPropagation(); 
    setShowRPC(true);
  }

  const [open, setOpen] = useState(false);

  const copyToClipBoard = (e:any) => {

    e.preventDefault();
    if(e && e.stopPropagation) e.stopPropagation(); 


    setOpen(true);
    navigator.clipboard.writeText(chainData[chainid as keyof object]["rpc_url"]);
    setShowRPC(false);
  };

  return (
    <div className={styles.networkItem} onClick={onClick}>

        <Snackbar
          message="Copied to clibboard"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          open={open}
        />
        <div className={styles.info}>
          <div className={styles.icon}><img src={"/images/token-icons/" + chainData[chainid as keyof object]["symbol"] + ".png"}/></div>
          {!showRPC && <div className={styles.chain}><span className={styles.dot}></span>{chainData[chainid as keyof object]["chainName"]}</div>}
          {showRPC && <div className={styles.chain}><span className={styles.dot}></span>{chainData[chainid as keyof object]["rpc_url"]}</div>}
        </div>
        
        <div className={styles.setting}>
          {!showRPC && <span className={styles.setting_icon} onClick={onShowRPC}><SettingsOutlinedIcon/></span>}
          {showRPC && <span className={styles.setting_icon} onClick={copyToClipBoard}><LibraryAddCheckOutlinedIcon/></span>}

          {isfavourite && <span onClick={addFavourite}><StarRoundedIcon sx={{color: "rgb(255, 226, 112)"}}/></span>}
          {!isfavourite && <span onClick={addFavourite}><StarBorderRoundedIcon /></span>}
        </div>
    </div>
  );
};

export default NetworkItem;
