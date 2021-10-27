import mongoose from 'mongoose'
import socket from 'socket.io'
import http from 'http'
import app from './app'

const DB = 'mongodb://localhost:27017/test'

const server: http.Server = new http.Server(app)
const io = new socket.Server(server)

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
  .connect(DB)
  .then(() => console.log('DB connection successfull'))