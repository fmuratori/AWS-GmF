import mongoose from 'mongoose'
import http from 'http'
import dotenv from 'dotenv'
import app from './app'

// express server
const httpServer: http.Server = new http.Server(app)

//interfaccia definita per creare la lista di key-value userId-socketId
interface userSocketId{
  [userId: string]: string
}
let activeSoket: userSocketId = {}

import { Server, Socket } from "socket.io";
import { addMessageToChat } from './controllers/donationController'

const io = new Server(httpServer, {});
io.on("connection", (socket: Socket) => {

  /**
   * da chiamare quando l'utente si logga
   * serve per associare nel server l'id utente all'id della socket
   */
  socket.on("initialize", (userId: string) => {
    console.log("associato il socket-id: " + socket.id + " all'utente " + userId)
    activeSoket[userId] = socket.id
  })

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