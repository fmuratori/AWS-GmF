import mongoose from 'mongoose'
import http from 'http'
import dotenv from 'dotenv'
import app from './app'

// express server
const httpServer: http.Server = new http.Server(app)

import { Server, Socket } from "socket.io";

const io = new Server(httpServer, {});
io.on("connection", (socket: Socket) => {
  console.log("OK");

  socket.emit("message_to_client", "asd");

  socket.on("message_to_server", (message: String) => {
    console.log(message)
  })

});
httpServer.listen(3001);

dotenv.config({ path:  __dirname + '/../properties.env' });

mongoose
  .connect(process.env.DB || "missing db path")
  .then(() => console.log('DB connection successfull'))