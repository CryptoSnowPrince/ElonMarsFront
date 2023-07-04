import React, { useState } from "react";
import { chainData } from "../../hook/data";
import styles from "./Pool.module.scss";

interface Props{
  chain: number;
  pool: any;
  share: any;
}

const Pool = ({chain, pool, share}:Props) => {

  return (
    <div className={styles.pool}>
      <div className={styles.item}>
        <span style={{display:"flex", alignItems:"center"}}>
          <img alt="BNB" src="https://app.multichain.org/static/media/ETH.cec4ef9a.svg" style={{marginRight: "5px"}}/>
          {String(chainData[chain as keyof object]["chainName"]).replace("mainnet", "")} Pool: 
        </span>
        <a><span className={styles.cont}>{pool} {String(chainData[chain as keyof object]["symbol"])}</span></a>
      </div>
      <div className={styles.item}>
        <span>Your Pool Share: </span>
        <a><span className={styles.cont}>{share} {String(chainData[chain as keyof object]["symbol"])}</span></a>
      </div>
    </div>
  );
};

export default Pool;
