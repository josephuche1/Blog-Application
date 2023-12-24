import React, {createContext} from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const socket = io("http://localhost:5000", {transports: ["websocket"]});

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}