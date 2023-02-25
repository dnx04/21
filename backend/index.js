const express = require("express");
const path = require("path");

const { WebSocketServer } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { ACTIONS } = require('constants');
/* WEBSOCKET */


const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const actualWsPort = process.env.WS_PORT || 3080;

server.listen(actualWsPort, () => {
  console.log(`WebSocket server is running on port ${actualWsPort}`);
});

// I'm maintaining all active users in this object
const clients = {};
const usernames = {};

// A new client connection request received
wsServer.on('connection', function(connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  console.log(`${userId} connected.`);
});

wsServer.on()



/* HTTP */

const app = express();
app.use(function(req, res, next){
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});


app.use(express.static(path.resolve(__dirname, '../frontend/build')));


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

const actualPort = process.env.PORT || 3001;

app.listen(actualPort, function() { 
    console.log(`Server now listening on port ${actualPort}`);
});