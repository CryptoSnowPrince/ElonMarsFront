import React, { useState, useEffect } from "react";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface Props{
  address:string;
  size: number;
}

const AccountIcon = ({address, size}:Props) => {
  return (
    <>
       <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />
    </>
  );
};

export default AccountIcon;
