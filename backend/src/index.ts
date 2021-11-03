import mongoose from 'mongoose'
import http from 'http'
import dotenv from 'dotenv'
import app from './app'

// express server
const httpServer: http.Server = new http.Server(app)

import { Server, Socket } from "socket.io";
import { addMessageToChat } from './controllers/donationController'

const io = new Server(httpServer, {});
io.on("connection", (socket: Socket) => {
  console.log("id socket: " + socket.id)

  socket.emit("message_to_client", "asd")
  socket.on("message_to_server", (obj: any) => {
    console.log("message_to_server: " + obj.message)
    addMessageToChat(obj.donationId, obj.userId, obj.message)
  })

});
httpServer.listen(3001);

dotenv.config({ path: __dirname + '/../properties.env' });

mongoose
  .connect(process.env.DB || "missing db path")
  .then(() => console.log('DB connection successfull'))