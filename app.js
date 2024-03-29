const http = require("http");
const express = require("express");
const cors = require("cors");
const ctrl = require('./controller');

const { Server } = require("socket.io");


const app = express();

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});

global.io = io

app.use(cors());

app.get("/set-notify/:id", ctrl.setNotify);

io.on("connection", (socket) => {
  console.log(socket.id, "=================================== Masuk koneksi baru ============================")
  socket.on("newUser", (userId) => {
    ctrl.addNewUser(userId, socket.id);
    ctrl.setFirstNotify(userId, socket.id)
    console.log(socket.id, userId, "===================== Ini Masuk emit awal awal ======================= ")
  });


  socket.on("disconnect", () => {
    ctrl.removeUser(socket.id);
  });
});

module.exports = server;
