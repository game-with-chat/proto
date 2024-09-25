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
  console.debug("[socket:connection]",socket.id)
  const player = {id:socket.id};

  function checkAuth() {
    if(!("username" in player))
      socket.emit("auth");
    return "username" in player
  }

  socket.on("auth",auth=>{
    console.debug("[socket:auth]",auth)
    player.username = auth;
    socket.emit("welcome",auth)
  })

  socket.on("disconnect",()=>{
    console.debug("[socket:disconnect]",socket.id)
    if(!("room" in player)) return
    delete players[player.room][player.id]
    io.to(player.room).emit("leave",player.id);
  })

  socket.on("move",pos=>{
    console.debug(players)
    console.debug("[socket:move]",pos);
    if(!checkAuth()) return;
    if(!("room" in player)) return
    player.pos = pos;
    io.to(player.room).emit("move",player);
  })

  socket.on("join",room=>{
    console.debug("[socket:join]",room);
    if(!checkAuth()) return;
    players[room] ||= {};
    players[room][socket.id] = player;
    io.to(room).emit("join",player)
    socket.join(room)
    player.room = room;
    socket.emit("room",Object.values(players[room]))
    })
})

server.listen(port, () => {
  console.debug(`Server running http://localhost:${port}`)
})