const express = require('express');
const {createServer} = require("node:http")
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;
const app = express()
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'))

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

io.on("connected",socket=>{
  console.log("[socket] a user connected")
})