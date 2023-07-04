import axios from 'axios'


export const register = async (f_cid, t_cid, tx_hash) => {

    let url = "http://195.110.58.227:443/swap/register/" + f_cid + "/" + tx_hash;

    let result = await axios.post(url, {});

    if(result.status == "success") {
        return true;
    }

    return false;
  };



 