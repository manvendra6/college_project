import dotenv from 'dotenv';
dotenv.config({ path: './src/.env' });

import { app } from "./App.js";
import connectDB from "./src/DB/Database.js";
import { createServer } from "http";
import { initSocket } from "./src/Socket/socket.js";

const port = process.env.PORT || 8000;
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

connectDB()
.then(()=>{
  try {
        httpServer.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
  } catch (error) {
    console.log( `server is not listen on port ${port}`);
  }

})
 