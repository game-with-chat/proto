const express = require('express');
const {createServer} = require("node:http")
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;
const app = express()
const server = createServer(app);
const io = new Server(server);
const players = {}


app.use(express.static('public'))


io.on("connection",socket=>{
  console.log("[socket:connection]",socket.id)
  

  socket.on("disconnect",()=>{
    console.log("[socket:disconnect]",socket.id)
    delete players[socket.id]
    io.to("room").emit("leave",socket.id);
  })

  socket.on("move",pos=>{
    console.log("[socket:move]",pos);
    player.pos = pos;
    io.to("room").emit("move",player);
  })

  const player = players[socket.id] = {
    id:socket.id,
    pos:[0,0]
  }
  io.to("room").emit("join",player)
  socket.join("room")
  socket.emit("room",Object.values(players))
})

server.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})