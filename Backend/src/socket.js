import { Server } from "socket.io";

let io;
const userSockets = new Map();

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        socket.on("register", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            for (let [key, value] of userSockets.entries()) {
                if (value === socket.id) {
                    userSockets.delete(key);
                    break;
                }
            }
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const getUserSocket = (userId) => {
    return userSockets.get(userId?.toString());
};
