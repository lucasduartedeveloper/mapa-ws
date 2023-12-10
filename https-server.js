'use strict';

const https = require('https');
const fs = require('fs');
 
//pass in your express app and credentials to create an https server
var httpsServer = https.createServer({
  cert: fs.readFileSync('sslcert/cert.pem', 'utf8'),
  key: fs.readFileSync('sslcert/key.pem', 'utf8')
});
httpsServer.listen(3000, () => console.log(`Listening on ${PORT}`));

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server: httpsServer });

// Conexão
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => console.log("Client disconnected"));

  // Mensagem
  ws.on("message",  (msg) => {
      var msgHeader = msg.split("|");

      // change in: remote-gamepad.js, remote-loop.js, nes-emulator.js, remote-calendar.js
      msgHeader[2] = msgHeader[2].replace("get","A"); 
      msgHeader[2] = msgHeader[2].replace("seq","B");

      msgHeader = msgHeader.slice(0, 4).join("|");
      console.log("%c'Message received' ["+getCurrentTime()+"]: %c"+msgHeader, "color: green", "color: lightblue");
      wss.clients.forEach((client) => {
           client.send(msg);
      });
   });

});

// Format time
var getCurrentTime = function() {
  var date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  var date = ("0" + date_ob.getDate()).slice(-2);
  
  // current month
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
  // current year
  var year = date_ob.getFullYear();
  
  // current hours
  var hours = date_ob.getHours().toString().padStart(2, "0");
  
  // current minutes
  var minutes = date_ob.getMinutes().toString().padStart(2, "0");
  
  // current seconds
  var seconds = date_ob.getSeconds().toString().padStart(2, "0");

  return date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
};

/*
setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
*/
