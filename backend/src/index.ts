import mongoose from 'mongoose'
import socket from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import app from './app'

const server: http.Server = new http.Server(app)
const io = new socket.Server(server)

dotenv.config({ path:  __dirname + '/../properties.env' });

io.on('connection', (socket) => {
  console.log('user connected')
  
  socket.on('chat message', (msg) => {
    io.emit('emit message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

mongoose
  .connect(process.env.DB || "missing db path")
  .then(() => console.log('DB connection successfull'))