import { io } from "socket.io-client";
import config from "./config";
import { CREATE_ROOM_SUCCESS } from "../store/pvp/action-types";
import { useDispatch } from "react-redux";
import { createRoom } from "../store/pvp/actions";

const options = {
    path: '/socket.io/',
    rememberUpgrade: true,
    transports: ["websocket"],
    secure: true,
    rejectUnauthorized: false,
};

export const HostingURI = `${config.server}:${config.port}`;
// export const HostingURI = "https://api.sungames777.com:8443";

let isInited = false;

export const setSocketInited = () => {
    isInited = true;
}

export const getSocketInited = () => {
    return isInited;
}

const socket = io.connect(HostingURI, options);

export default socket;