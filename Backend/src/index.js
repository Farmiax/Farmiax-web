import dotenv from "dotenv";
import connectedDB from "./DB/index.js";
import app from "./app.js";
import http from 'http';
import { initSocket } from './socket.js';

dotenv.config({
    path:"./.env"
})

const server = http.createServer(app);
initSocket(server);

connectedDB()
.then( ()=>{
    server.listen(process.env.PORT|| 5000,()=>{
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MangoesDB is connected error",err)
})