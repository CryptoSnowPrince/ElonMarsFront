import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import {Box, TextField} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Tooltip } from '@mui/material';
import NetworkItem from "../NetworkItem/NetworkItem";
import { chainData } from "../../hook/data";
import { useWeb3Context } from "../../hook/web3Context";
import { shortAddress } from "../../utils/tools";
import AccountIcon from "../AccountIcon/AccountIcon";

import config from "../../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { saveDiscord } from "../../store/user/actions";
import { onShowAlert } from "../../store/utiles/actions";

interface Props{
    openAccount: any;
    setOpenAccount: any;
}

const HeaderModal = ({openAccount, setOpenAccount}:Props) => {

  const dispatch = useDispatch<any>();

  const mobileView = useMediaQuery('(max-width:760px)');

  const userModule = useSelector((state:any) => state.userModule); 
  const {user} = userModule;

  const handleOpen = () => setOpenAccount(true);
  const handleClose = () => setOpenAccount(false);

  const [copied, setCopied] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const { connected, chainID, address, connect } = useWeb3Context();
  const [editable, setEditable] = useState(true);

  const copyToRef = (e:any) => {
    e.preventDefault();
    if(e && e.stopPropagation) e.stopPropagation(); 

    navigator.clipboard.writeText(config.websiteURL+"/?ref="+user.userRef);
    setCopiedRef(true);

    setTimeout(()=>{
      setCopiedRef(false);
    }, 500);
    
  }

  const copyToClipBoard = (e:any) => {

    e.preventDefault();
    if(e && e.stopPropagation) e.stopPropagation(); 

    navigator.clipboard.writeText(address);
    setCopied(true);

    setTimeout(()=>{
      setCopied(false);
    }, 500);
  };

  const [discord, setDiscord] = useState("asdfasdf");
  const handleChange = (e:any) => {
    setDiscord(e.target.value);
  }

  const onSaveDiscord = () => {
    if(editable) {
      setEditable(!editable);
    } else {
      dispatch(saveDiscord(address, discord, (res:any)=>{
        setEditable(!editable);
        dispatch(onShowAlert("Save discord username successfully", "success"));
      }));      
    }
  }

  useEffect(()=>{
    setDiscord(user.discord);
  }, [user.discord]);


  return (
    <>
      <Modal
        open={openAccount&&(address!=""&&address)}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.title}>
              <div>Account</div>
            </div>
            <div className={styles.close} onClick={handleClose}><img src='/icons/icon-close.png'/></div>
          </div>

          <div className={styles.hr}></div>
          <div style={{ padding: "0rem 1rem"}}>

            <Box sx={{p:1, display:"flex", alignItems:"center", width:"100%", justifyContent:"space-around"}}>
              <TextField 
                sx={{ input: { color: 'white', WebkitTextFillColor:"#ed6c02 !important" }, WebkitTextFillColor:"#ed6c02 !important" }} 
                label="Discord Name" 
                variant="filled" 
                color="warning" 
                defaultValue="Disabled"
                focused 
                disabled={editable}
                value = {discord} 
                onChange={handleChange} />
              <Button variant="outlined" color="warning" onClick={onSaveDiscord}>{editable?"Edit":"Save"}</Button>
            </Box>

            <div className={styles.modalContents}>
              <div style={{fontWeight: "500", fontSize: "1.25rem", display:"flex", alignItems:"center"}}>
                  <span style={{display:"flex", alignItems:"center", marginRight: "8px"}}><AccountIcon address={address} size={20}/></span>
                  <span>{shortAddress(address)}</span>
              </div>
              <div>
                <div style={{display:"flex", flexFlow: mobileView?"column":"row nowrap", alignItems:"center"}}>
                    {!copied && <div className={styles.copyAddress} onClick={copyToClipBoard}><ContentCopyIcon sx={{width:"17px"}}/><span>Copy Address</span></div>}
                    {copied && <div style={{display:"flex", alignItems:"center"}}><TaskAltRoundedIcon sx={{width:"17px"}}/>&nbsp;Copied</div>}

                    { chainData[chainID as keyof object] && <div style={{marginLeft:"20px"}}>
                        <a 
                          href={(chainData[chainID as keyof object]["explorer"]) + "/address/" + address}
                          className={styles.viewOnExplorer}
                        >
                            <OpenInNewIcon/><span>View on Explorer</span>
                        </a>
                    </div>}
                </div>
              </div>
            </div>

            <div>
              <Box sx={{mb: 2, display:"flex", flexFlow: "column nowrap", alignItems:"center"}}>

                <p style={{display:"flex", alignItems:"center"}}>
                  Referral Link &nbsp;
                  {!copiedRef &&<ContentCopyIcon sx={{width:"17px", cursor:"pointer"}} onClick={copyToRef}/>}
                  {copiedRef &&<TaskAltRoundedIcon sx={{width:"17px"}}/>}
                </p>

                <p>{config.websiteURL+"/?ref="+user.userRef}</p>

                  {/* {!copiedRef && <div className={styles.copyAddress} onClick={copyToRef}><ContentCopyIcon sx={{width:"17px"}}/><span>Referral Link:</span></div>}
                  {copiedRef && <div style={{display:"flex", alignItems:"center"}}><TaskAltRoundedIcon sx={{width:"17px"}}/>&nbsp;Copied</div>} */}
                <Box>
                <p>Referrals: {user.referrals}</p>
                <p>Earned: {user.earned}</p>
                </Box>

              </Box>

              
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default HeaderModal;
