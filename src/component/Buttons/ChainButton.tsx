import React, { useState, useEffect } from "react";
import styles from "./Buttons.module.scss";
import { chainData } from "../../hook/data";

interface Props{
  chain: number;
  onClick:any;
}

const ChainButton = ({chain, onClick}:Props) => {

  const onOpenModal = (e:any) => {
    onClick(e);
  }

  return (
    <button className={styles.button} onClick={onOpenModal}>
        <div className={styles.button_contents}>
            <div className={styles.icon}>
                <img src={"/images/chainIcons/" + chainData[chain as keyof object]["chain"] + ".png"} className="sc-gzOgki lbqERF" alt={chainData[chain as keyof object]["chain"]}/>
            </div>
            <div className={styles.chain_name}>
              <small>{chainData[chain as keyof object]["chainName"]}</small>
            </div>
            <div className={styles.arrow}>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="sc-iuJeZd diJvek"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
            </div>
        </div>
    </button>
  );
};

export default ChainButton;
