import React, { useState } from "react";
import styles from "./SendTo.module.scss";

interface Props{
  sendWallet:string;
  setSendWallet:any;
}

const SendTo = ({sendWallet, setSendWallet}:Props) => {

  const onChange = (e:any) => {
    setSendWallet(e.target.value);
  }

  return (
    <>
      <div className={styles.sendto}>
        <div className={styles.contents}>
          <div className={styles.main}>
            <div>Recipient<span>( Please do NOT send funds to exchange wallet or custodial wallet. )</span></div>
            <div><input className={styles.input} value = {sendWallet} onChange={onChange}/></div>
          </div>
        </div>        
      </div>
    </>
  );
};

export default SendTo;
