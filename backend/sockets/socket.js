import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], 
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; 

/**
 * Gets the socket ID for a given receiver's user ID.
 * This function is used to send direct notifications.
 * @param {string} receiverId - The user ID of the person who should receive the message.
 * @returns {string | undefined} The socket ID of the receiver, or undefined if they are not online.
 */
export const getRecieversSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);
    
    // Get the userId from the handshake query sent by the frontend client
    const userId = socket.handshake.query.userId;
    
    // If a userId was provided, add the user to our map.
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Broadcasted online users:", Object.keys(userSocketMap));

    // Handle the disconnect event, which fires when a user closes the browser tab
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        
        // Find the userId associated with the disconnected socket and remove them from the map.
        const disconnectedUserId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
            console.log(`User ${disconnectedUserId} unmapped.`);
        }
        
        // --- FIX FOR ONLINE USERS ---
        // Broadcast the new, smaller list of online users to ALL clients again.
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log("Broadcasted online users after disconnect:", Object.keys(userSocketMap));
    });
});

export { app, io, server };