import React, { useState } from "react";
import styles from "./Buttons.module.scss";
import { chainData, getTokenDetail } from "../../hook/data";

interface Props{
  token?: string;
  name: number;
  onClick:any;
}

const TokenButton = ({token, name, onClick}:Props) => {

  const onOpenModal = (e:any) => {
    onClick(e);
  }

  return (
    <button className={styles.button} onClick={onOpenModal}>
        <div className={styles.button_contents}>
            <div className={styles.icon}>
                <img src={"/images/token-icons/" + token + ".png"} className="sc-gzOgki lbqERF" alt="ETH"/>
            </div>
            <div className={styles.chain_name}>
              <p>{token}</p>
              <small>{name}</small>
            </div>
            <div className={styles.arrow}>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className="sc-iuJeZd diJvek"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
            </div>
        </div>
    </button>
  );
};

export default TokenButton;
