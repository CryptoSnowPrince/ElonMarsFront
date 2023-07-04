import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography  } from '@mui/material';
import Modal from '@mui/material/Modal';
import styles from "./Area.module.scss";
import Header from "../Header/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWeb3Context } from '../../hook/web3Context';
import { claimBird, claimDiamond, stakeBird, stakeDiamond, swapEggs, swapResources } from '../../store/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST, STAKE_TIMER } from "../../hook/constants";
import { showMinutes } from "../../utils/timer";
import GoldMineModal from "../Modal/GoldMineModal";
import UraniumMineModal from "../Modal/UraniumMineModal";
import PowerPlantModal from "../Modal/PowerPlantModal";

interface Props{
    gbaks : any,
    resource : any,
    eggs : any,
    position: any;
    mapStatus:any;
    items:any;
    defaultItems:any;
    setItems:any;
    onBuyMap:any;

    showAccount: any;
    setShowAccount: any;
}

const Area = ({
    gbaks,
    resource,
    eggs,
    position, mapStatus, items, defaultItems, setItems, onBuyMap, showAccount, setShowAccount
}:Props) => {

    const mobileScreen = useMediaQuery("(max-width:1300px)");

    const userModule = useSelector((state:any) => state.userModule); 
    const {user} = userModule;

    const dispatch = useDispatch<any>();
    const { connected, chainID, address, connect } = useWeb3Context();
    
    const birdData = [
      [
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0}
      ],
      [
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0}
      ],
      [
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0},
        {item:0, timer:0},{item:0, timer:0}
      ]
    ];

    const [birds, setBirds] = useState(birdData);

    const diamonds=[
        1, 2
    ];

  useEffect(()=>{
    
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openBird, setOpenBird] = useState(false);
  const handleBirdOpen = () => setOpenBird(true);
  const handleBirdClose = () => setOpenBird(false);

  const [openGoldMine, setOpenGoldMine] = useState(false);
  const [openUraniumMine, setOpenUraniumMine] = useState(false);
  const [openPowerPlant, setOpenPowerPlant] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedBirdIndex, setSelectedBirdIndex] = useState(0);

  const showModal = (index:any) => {
    if(gbaks<20) {
      return;
    }
    setSelectedIndex(index);
    handleOpen()
  }

  const showBirdModal = (index:number) => {
    
    setSelectedBirdIndex(index);
    handleBirdOpen()
  }

  const setItem = (item:any) => {

    dispatch(stakeDiamond(address, (position+1)*10+selectedIndex, item, (res:any)=>{}));

    let _items = [...items];
    _items[selectedIndex].item = item;
    _items[selectedIndex].timer = STAKE_TIMER;
    setItems(_items);
    handleClose();
  }

  const setBirdItem = (index:any, item:any) => {
    
    if(gbaks<20)  return;
    dispatch(stakeBird(address, (position+1)*100+selectedBirdIndex*10+index, (res:any)=>{}));

    let _items = [...birds];
    _items[selectedBirdIndex][index].item = item;
    _items[selectedBirdIndex][index].timer = STAKE_TIMER;
    setBirds(_items);
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
      xs:200,
      sm:400,
      md:800
    },
    background: "url(/images/modal-back.png)",
    backgroundSize: "100%",
    bgcolor: 'background.paper',
    maxHeight: "500px",
    overflow: "auto",
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const onClaim = (e:any, index:number) => {
    e.stopPropagation() ;

    let _items = [...items];
    _items[index].item = 0;
    _items[index].timer = 0;
    setItems(_items);

    dispatch(claimDiamond(address, (position+1)*10+index, (res:any)=>{}));
  }

  const onClaimBird = (e:any, index:number) => {
    e.stopPropagation() ;

    let _items = [...birds];
    _items[selectedBirdIndex][index].item = 0;
    _items[selectedBirdIndex][index].timer = 0;
    setBirds(_items);

    dispatch(claimBird(address, (position+1)*100+selectedBirdIndex*10+index, (res:any)=>{}));
  }

  let timer:any = null;
  const startTimer = () => {
    if (timer == null) {
      timer = setInterval(()=>{
        setItems((prevItem:any)=>{
          
          let _item = [...prevItem];
          _item = _item.map((value)=>{
            if(value.timer > 0) value.timer--;
            return value;
          });
          return _item;
        });

        setBirds((prevItem)=>{
          
          let _item = [...prevItem];
          _item = _item.map((birdlist)=>{

            birdlist = birdlist.map((value)=>{
              if(value.timer > 0) value.timer--;
              return value;
            })
            
            return birdlist;

          });
          return _item;
        });
      }, 1000);
    }
  }

  useEffect(()=>{
    
    startTimer();
    
    return () => clearInterval(timer);
  }, [JSON.stringify(items)]);

  // set staked diamond
  useEffect(()=>{
      
      let _items = [...defaultItems];
      for (let dt of user.stakedDiamond) {
        if(!dt) continue;
        if((position+1)*10 > dt.position || (position+2)*10 <= dt.position) continue;

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        let realPos = dt.position - (position+1)*10;
        _items[realPos].item = dt.diamond;
        _items[realPos].timer = STAKE_TIMER - Math.floor((curSec - endSec)/1000)
        if(_items[realPos].timer < 0) _items[realPos].timer = 0;
      }
      
      setItems(_items);

  }, [JSON.stringify(user.stakedDiamond)]);

  useEffect(()=>{

      
      let _items = [...birdData];
      for (let dt of user.stakedBirds) {
        if(!dt) continue;
        if((position+1)*100 > dt.position || (position+2)*100 <= dt.position) continue;
        let pos = Math.floor((dt.position%100)/10);
        let index = (dt.position%100)%10

        let date = new Date();
        let curSec = date.getTime();
        let endSec = new Date(dt.staked_at).getTime();

        let realPos = dt.position - (position+1)*10;
        _items[pos][index].item = dt.diamond;
        _items[pos][index].timer = STAKE_TIMER - Math.floor((curSec - endSec)/1000)
        if(_items[pos][index].timer < 0) _items[pos][index].timer = 0;
        
      }
      setBirds(_items);

  }, [JSON.stringify(user.stakedBirds)])

  return (
    <>
    
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={{...style, width:{sm:400, md:400}}}>
          <Grid container spacing={3}>
            {diamonds.map((item, index)=>(
              <Grid item key = {index} xs={6} sm={6} md={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Box
                  sx={{
                    width:"100px",
                    cursor:"pointer",
                    
                  }}

                  // onClick={(e)=>setItem(item)}
                >
                  {item == 1 && <img src='/images/diamond_1.png'/>}
                  {item == 2 && <img src='/images/diamond_2.png'/>}
                  <Box sx={{textAlign:"center"}}>
                    <Button 
                      sx={{
                        padding: "10px 4px"
                      }}
                      variant="contained" 
                      color='success'
                      onClick={(e)=>setItem(item)}
                    >
                        20 Gbaks
                    </Button>
                    
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
    </Modal>

    <Modal
        open={openBird}
        onClose={handleBirdClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
    <Box sx={style}>
        <Grid container spacing={3}>
        {birds[selectedBirdIndex].map((item, index)=>(
            <Grid item key = {index} xs={6} sm={3} md={1.5}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
            <Box
                sx={{
                width:"100px",
                cursor:"pointer",
                position: "relative",
                }}
                // onClick={(e)=>setBirdItem(index, item)}
            >
              {<img src='/images/bird.png'/>}
              <Box sx={{textAlign:"center"}}>
                {item.item == 0 && <Button 
                  sx={{
                    padding: "10px 4px"
                  }}
                  variant="contained" 
                  color='success'
                  onClick={(e)=>setBirdItem(index, item)}
                >
                    20 Gbaks
                </Button>}
                
                {item.item!=0 && <>
                  {
                    item.timer != 0 ? <Button sx={{ padding: "10px 4px", backgroundColor:"#736b6b", color:"white !important" }} variant="outlined" disabled>
                      {showMinutes(item.timer)}
                    </Button> : 
                    <Button variant="contained" color='success' onClick={e => onClaimBird(e, index)} >Claim</Button>
                  }
                </>}
                
              </Box>
                {/* {item.item != 0 && <Box sx={{
                    position:"absolute",
                    top:"50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign:'center',
                    backgroundColor: "#fffdfdba",
                    // border: "3px solid black",
                }}>
                    {
                    item.timer != 0 ? 
                        (<Box sx={{fontSize:"30px"}}> {item.timer} </Box> ) :
                        (<Box>
                        <Button variant="contained" color='success' onClick={e => onClaimBird(e, index)} >Claim</Button>
                        </Box>)
                    }
                </Box>}
                 */}
            </Box>
            </Grid>
        ))}
        </Grid>
    </Box>
    </Modal>


    <GoldMineModal open = {openGoldMine} setOpen = {setOpenGoldMine} />
    <UraniumMineModal open = {openUraniumMine} setOpen = {setOpenUraniumMine} />
    <PowerPlantModal open = {openPowerPlant} setOpen = {setOpenPowerPlant} />
    


    <Box sx={{width:"50%", backgroundColor:mapStatus?"none":"#000000b3", position:"relative"}}>

        {position==0&&<Header 
          showAccount={showAccount}
          setShowAccount={setShowAccount}
        />}

        {!mapStatus && <Button variant="contained" color="success" sx={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)", zIndex:999}}
            onClick={(e)=>onBuyMap(position)}
        >Buy {LAND_COST[position-1]}SPX</Button>}
        {items.map((item:any, index:number)=>(
            <Box
            sx={{
                position: "absolute",
                top: `${item.posy}`,
                left: `${item.posx}`,
                width:`${item.item == 0?item.width:"100px"}`,
                cursor:"pointer",
                margin:"auto",
                pointerEvents:mapStatus?"true":"none",
                opacity: mapStatus?1:0.2
            }}

            onClick={(e)=>{
                if(item.item==0 && mapStatus) {
                    if(item.type == 0) showBirdModal(index);
                    else showModal(index);
                }
            }}
            >
            {item.item == 0 ?
                (<Box sx={{
                  position:"absolute", 
                  top: `${item.type==3 ?"18px":"26px"}`, 
                  left: `${item.type==3 ?"-14px":"0"}`, 
                  width:`${item.type==3 ?"100px":"100px"}`, 
                  zIndex: 1,
                }}>
                <img className={styles.item} src={`/images/place_${item.type}.png`}/>
                </Box>)
                : (<Box>
                    
                    {item.item != 0 && <Box sx={{
                      position:"absolute",
                      top:"50%",
                      transform: "translate(0, -50%)",
                      width: "100%",
                      textAlign:'center',
                      backgroundColor: "#fffdfdba",
                      zIndex: 5
                    }}>
                    {
                        item.timer != 0 ? 
                        (<Box> {showMinutes(item.timer)} </Box> ) :
                        (<Box>
                            {/* <Button variant="contained" color='success' onClick={e => onClaim(e, index)} >Claim</Button> */}
                        </Box>)
                    }
                    </Box>}
                    <Box 
                      className={(item.item!=0 && item.timer==0) ? styles.active : ""} 
                      style={{position:"relative", zIndex: 4}} 
                      onClick={e => {
                        if(item.item!=0 && item.timer==0)
                          onClaim(e, index);
                        else alert("please wait...");
                      }}
                    >
                      <img src={`/images/diamond_${item.item}.png`}/>
                    </Box>
                    {/* <img style={{position:"relative", zIndex: 4}} src={`/images/diamond_${item.item}.png`}/> */}
                    <Box sx={{
                      position:"absolute", 
                      top: `${item.type==3 ?"18px":"26px"}`, 
                      left: `${item.type==3 ?"-14px":"0"}`, 
                      width:`${item.type==3 ?"100px":"100px"}`, 
                      zIndex: 1,
                      opacity: 0.6
                    }}>
                      <img src={`/images/place_${item.type}.png`}/>
                    </Box>
                </Box>)
            }
            </Box>
        ))}

        {position == 0 && <Box
          sx={{
            position: "absolute",
            top: `131px`,
            left: mobileScreen ? "447px" : "500px",
            width:"157px",
            cursor:"pointer",
            margin:"auto",
            pointerEvents:mapStatus?"true":"none",
            opacity: mapStatus?1:0.2
          }}
          
          onClick={(e)=>{setOpenPowerPlant(true)}}
        >
            <Box>
              <img className={styles.item} src={`/images/power_plant.png`}/>
            </Box>
        </Box>}

        {position == 1 && <Box
          sx={{
            position: "absolute",
            top: `210px`,
            left: mobileScreen ? `435px` : "480px",
            width:"157px",
            cursor:"pointer",
            margin:"auto",
            pointerEvents:mapStatus?"true":"none",
            opacity: mapStatus?1:0.2
          }}

          onClick={(e)=>{setOpenGoldMine(true)}}
        >
            <Box>
              <img className={styles.item} src={`/images/mine2.png`}/>
            </Box>
        </Box>}

        {position == 2 && <Box
          sx={{
            position: "absolute",
            top: `131px`,
            left: mobileScreen ? "480px" : "520px",
            width:"157px",
            cursor:"pointer",
            margin:"auto",
            pointerEvents:mapStatus?"true":"none",
            opacity: mapStatus?1:0.2
          }}
          
          onClick={(e)=>{setOpenUraniumMine(true)}}
        >
            <Box>
              <img className={styles.item} src={`/images/mine1.png`}/>
            </Box>
        </Box>}
    </Box>
  </>
)};

export default Area;
