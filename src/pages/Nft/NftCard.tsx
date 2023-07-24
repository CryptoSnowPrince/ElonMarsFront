import { Box } from '@mui/material';

interface CardProps {
    id: number,
    action: any,
}

const earn0 = ['Common 80%', 'Common 75%', 'Common 60%']
const earn1 = ['Uncommon 20%', 'Uncommon 20%', 'Uncommon 30%']
const earn2 = ['', 'Rare 5%', 'Rare 10%']
const NftCard = ({ id, action }: CardProps) => {
    return (
        <>
            <Box>
                <img
                    style={{
                        width: "400px",
                        margin: "auto",
                        border: "black",
                        borderWidth: "10px",
                        borderRadius: "10px",
                        borderStyle: "outset"
                    }}
                    src={`/images/nfts/${id}.png`} alt='0' />
                <button
                    style={{
                        position: "absolute",
                        width: "200px",
                        height: "100px",
                        marginLeft: "-450px",
                        marginTop: "480px",
                        borderColor: "black",
                        borderWidth: "10px",
                        borderRadius: "10px",
                        borderStyle: "outset",
                        backgroundColor: "#b622b5",
                        color: "white",
                        fontSize: "30px",
                        fontWeight: "100",
                        cursor: "pointer"
                    }}
                    onClick={e => action(id)}
                >MINT</button>
                {id === 0 ?
                    <div style={{
                        position: "absolute",
                        width: "220px",
                        height: "80px",
                        paddingTop: "15px",
                        marginLeft: "220px",
                        marginTop: "-590px",
                        borderColor: "black",
                        borderWidth: "10px",
                        borderRadius: "10px",
                        borderStyle: "outset",
                        backgroundColor: "#b622b5",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "400",
                        textAlign: "center"
                    }}>
                        <div>Drop:</div>
                        <div>{`${earn0[id]}`}</div>
                        <div>{`${earn1[id]}`}</div>
                    </div> :
                    <div style={{
                        position: "absolute",
                        width: "220px",
                        height: "90px",
                        paddingTop: "5px",
                        marginLeft: "220px",
                        marginTop: "-590px",
                        borderColor: "black",
                        borderWidth: "10px",
                        borderRadius: "10px",
                        borderStyle: "outset",
                        backgroundColor: "#b622b5",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "400",
                        textAlign: "center"
                    }}>
                        <div>Drop:</div>
                        <div>{`${earn0[id]}`}</div>
                        <div>{`${earn1[id]}`}</div>
                        <div>{`${earn2[id]}`}</div>
                    </div>
                }

            </Box>
        </>
    );
};

export default NftCard;
