'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

// Conexão
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => console.log("Client disconnected"));

  // Mensagem
  ws.on("message",  (msg) => {
      console.log("Message received");
      wss.clients.forEach((client) => {
           client.send(msg);
      });
   });

});

/*
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
*/
