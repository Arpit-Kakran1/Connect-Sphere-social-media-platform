import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './utils/db.js';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js'
import postRoute from './routes/postRoute.js'
import messageRoute from './routes/messageRoute.js'
import { app, server } from './sockets/socket.js'
import { fileURLToPath } from 'url';
import path from "path";
dotenv.config({});

const PORT = process.env.PORT || 3000;

//Middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//Connecting frontend
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOption)); 

//All Api
app.use("/api/v1/user", userRoute);//User route
app.use("/api/v1/post", postRoute)//Post Route
app.use("/api/v1/message",messageRoute)//Message Route


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const staticPath = path.join(__dirname,"..", "frontend", "dist");

console.log("Serving static files from:", staticPath);

app.use(express.static(staticPath));
app.use((req, res) => {
    res.sendFile(path.join(__dirname,"..", "frontend", "dist", "index.html"));
})


server.listen(PORT, () => {
  connectDb();
  console.log(`Server started at ${PORT}`);
})