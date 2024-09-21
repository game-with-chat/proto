const express = require('express');
const {createServer} = require("node:http")
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;
const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'))


io.on("connection",socket=>{
  console.log("[socket:connection] a user connected")
  socket.on("disconnect",()=>{
    console.log("[socket:disconnect] a user disconnected")
  })
  socket.on("move",pos=>{
    console.log("[socket:move]",pos)
    io.emit("move",pos)
  })
})
server.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})