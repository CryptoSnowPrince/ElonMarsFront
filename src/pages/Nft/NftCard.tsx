import { Box } from '@mui/material';

interface CardProps {
    id: number,
    action: any,
}

const earn = [4500, 9000, 15000]
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
                <div style={{
                    position: "absolute",
                    width: "220px",
                    height: "80px",
                    paddingTop: "10px",
                    paddingLeft: "20px",
                    marginLeft: "220px",
                    marginTop: "-590px",
                    borderColor: "black",
                    borderWidth: "10px",
                    borderRadius: "10px",
                    borderStyle: "outset",
                    backgroundColor: "#b622b5",
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "400"
                }}>
                    <div>{`Earn: ${earn[id]} gh`}</div>
                    <div>Time: 24h</div>
                </div>
            </Box>
        </>
    );
};

export default NftCard;
