
const express = require("express");
const path = require("path");

const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } = require('./constants');
const { AVATAR_CNT, SPELL_PER_ROUND, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } = require('./constants');
const { qty, lasting, effect } = require('./spellEffect')
const { response } = require("express");
const { start } = require("repl");

/* WEBSOCKET */

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}



const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const actualWsPort = process.env.WS_PORT || 3080;

server.listen(actualWsPort, () => {
  console.log(`WebSocket server is running on port ${actualWsPort}`);
});

// Maintaining client connections and usernames here
let clients = {};
let userInfo = {};
let roomInfo = {};

/* Randomize array in-place using Durstenfeld shuffle algorithm */



function sendJson(json, userId) {

  console.log("Sending:");
  console.log(JSON.stringify(json, null, 2));
  console.log("to:");
  console.log(userId);
  console.log(userInfo[userId].username);
  console.log("-------------------------------------------------------------------");

  const data = JSON.stringify(json);
  let client = clients[userId];

  if (client.readyState === WebSocket.OPEN) {
    client.send(data);
  }
  else {
    console.log(userId + 'WebSocket is not open???')
  }
}



/* --- ROOM CONTROL --- */

function initRoom(roomCode) {
  roomInfo[roomCode] = {
    player: [],
    spellCardDeck: [],
    turn: 0,
    round: 0,
    winner: 0,
    targetScore: 21,
    consecutiveEnd: 0
  };
}

function addPlayerToRoom(roomCode, userId) {
  let room = roomInfo[roomCode];
  const playerStruct = {
    user: userId,
    onTable: [],
    onDeck: [],
    spellCards: [],
    spellTable: [],
    health: START_HEALTH,
    attack: 1,
    
    ready: 0,
  };
  room.player.push(playerStruct);
}

/* --- BROADCAST FUNCTIONS --- */


function broadcastGameState(roomCode) {
  let room = roomInfo[roomCode];
  let response = {
    id: "",
    responseType: RESPONSE_TYPE.GAME_STATE,
    data: {
      player: [],
      turn: room.turn,
      winner: room.winner,
      round: room.round,
      targetScore: room.targetScore,
      you: 0
    }
  }
  for (let p=0; p<2; p++) {
    let playerPublic = {
      username: userInfo[room.player[p].user].username,
      avatar: userInfo[room.player[p].user].avatar,
      onTable: JSON.parse(JSON.stringify(room.player[p].onTable)),
      spellCards: JSON.parse(JSON.stringify(room.player[p].spellCards)),
      spellTable: JSON.parse(JSON.stringify(room.player[p].spellTable)),
      health: room.player[p].health,
      attack: room.player[p].attack,
    }
    response.data.player.push(playerPublic);
  }
  for (let p=0; p<2; p++) {
    response.data.you = p

    if (room.turn !== ROUND_END) {
      response.data.player[1-p].onTable[0] = -1;
    }
    for (u in response.data.player[1-p].spellCards) 
      response.data.player[1-p].spellCards[u] = -1;

    sendJson(response, room.player[p].user);

    for (u in response.data.player[1-p].spellCards) 
      response.data.player[1-p].spellCards[u] = room.player[1-p].spellCards[u];

    response.data.player[1-p].onTable[0] = room.player[1-p].onTable[0];
  }
}

function broadcastGameLog(roomCode, log) {
  let response = {
    id: "",
    responseType: RESPONSE_TYPE.GAME_LOG,
    data: {
      log: log
    }
  };

  for (let p of response.player) sendJson(response, p.user);
}

/* --- GAME CONTROL --- */

function startRound(roomCode) {
  let room = roomInfo[roomCode];

  room.round++;
  room.turn = room.round % 2;
  room.consecutiveEnd = 0;

  for (let p=0; p<2; p++) {
    room.player[p].onDeck = [];
    for (let i=1; i<12; i++) {
      room.player[p].onDeck.push(i);
    }
    shuffleArray(room.player[p].onDeck);

    room.player[p].onTable = [];
    room.player[p].onTable.push(room.player[p].onDeck.shift());
    room.player[p].onTable.push(room.player[p].onDeck.shift());

    let newSpellTable = []
    for (let g of room.player[p].spellTable) if (lasting[g] === 1) {
      newSpellTable.push(g);
    } 
    room.player[p].spellTable = newSpellTable;

    for (let i = 0; i < SPELL_PER_ROUND; i++) if (room.player[p].spellCards.length < MAX_SPELL_IN_HAND)
    {
      room.player[p].spellCards.push(room.spellCardDeck.shift());
    }

    recalculateAtkAndTarget(room);
  }
}


/*
function initRoom(roomCode) {
  roomInfo[roomCode] = {
    player: [],
    spellCardDeck: [],
    turn: 0,
    round: 0,
    winner: 0,
    targetScore: 21,
    consecutiveEnd: 0
  };
}

function addPlayerToRoom(roomCode, userId) {
  let room = roomInfo[roomCode];
  const playerStruct = {
    user: userId,
    onTable: [],
    onDeck: [],
    spellCards: [],
    spellTable: [],
    health: START_HEALTH,
    attack: 1,
    
    ready: 0,
  };
  room.player.push(playerStruct);
}
*/


function recalculateAtkAndTarget(game) {
  game.targetScore = 21;
  for (p in game.player) game.player[p].attack = 1;
  for (p in game.player) {
    for (g in game.player[p].spellTable) {
      if (g === SPELL.CHANGE_17) game.targetScore = 17;
      if (g === SPELL.CHANGE_21) game.targetScore = 21;
      if (g === SPELL.CHANGE_24) game.targetScore = 24;
      if (g === SPELL.CHANGE_27) game.targetScore = 27;

      if (g === SPELL.ONE_UP) game.player[p].attack += 1;
      if (g === SPELL.TWO_UP) game.player[p].attack += 2;
      if (g === SPELL.GREED) game.player[p].attack += Math.ceil(game.player[1-p].spellCards.length / 2);
    } 
  }
}

function startGame(roomCode) {
  let room = roomInfo[roomCode];

  room.spellCardDeck = [];
  for (let i=0; i<6; i++) {
    for (let g in qty) {
      for (let j=0; j<qty[g]; j++)
      room.spellCardDeck.push(g);
    }
  }
  
  room.turn = 0;
  room.round = 0;
  room.winner = 0;
  room.targetScore = 21;
  room.consecutiveEnd = 0;

  for (p of room.player) {
    p.onTable = [];
    p.onDeck = [];
    p.spellCards = [];
    p.spellTable = [];
    p.health = START_HEALTH;
    p.attack = 1;
  }
  shuffleArray(room.spellCardDeck);
  
  startRound(roomCode);
}


function endRound(roomCode) {
  let room = roomInfo[roomCode];
  const target = room.targetScore;
  room.turn = ROUND_END;
  let sum0 = 0;
  for (let g of room.player[0].onTable) sum0+=g;
  let sum1 = 0;
  for (let g of room.player[1].onTable) sum1+=g;
  if (sum0<=target && sum1>target) {
    room.winner = 0;
  }
  else if (sum1<=target && sum0>target) {
    room.winner = 1;
  }
  else if (Math.abs(sum1-target) < Math.abs(sum0-target)) {
    room.winner = 1;
  }
  else if (Math.abs(sum0-target) < Math.abs(sum1-target)) {
    room.winner = 0;
  }
  else {
    room.winner === TIE;
  }

  if (room.winner !== TIE) {
    room.player[1-room.winner].health -= room.player[room.winner].attack;
    if (room.player[1-room.winner].health <= 0) {
      room.round = GAME_END;
    }
  }
  room.player[0].ready = 0;
  room.player[1].ready = 0; 
}

function draw(id, userId, roomCode) {
  let room = roomInfo[roomCode];
  let t = room.turn;
  if (room.player[t].onTable.length === MAX_CARD_ON_TABLE) {
    let error = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.TABLE_FULL
      }
    };
    sendJson(error, userId);
  }
  else {    
    room.consecutiveEnd = 0;
    room.player[t].onTable.push(room.player[t].onDeck.shift());
    room.turn = 1 - room.turn;
    let ok = {
      id: id,
      responseType: RESPONSE_TYPE.OK,
      data: {}
    };
    
    sendJson(ok, userId);
    broadcastGameState(roomCode);
  }
}


function playSpell(id, userId, roomCode, cardIndex) {
  let room = roomInfo[roomCode];
  let t = room.turn;

  if (cardIndex < room.player[t].spellCards.length && cardIndex >= 0) {
    room.consecutiveEnd = 0;
    console.log(room.player[t].spellCards);
    const cardPlayed = room.player[t].spellCards.splice(cardIndex, 1);
    room.player[t].spellTable.push(cardPlayed[0]);
    console.log(cardIndex);
    console.log(cardPlayed);
    console.log(cardPlayed[0]);
    effect[cardPlayed[0]](room);
    recalculateAtkAndTarget(room);

    let ok = {
      id: id,
      responseType: RESPONSE_TYPE.OK,
      data: {}
    };
    sendJson(ok, userId);
    broadcastGameState(roomCode);
    if (lasting[cardPlayed] !== 1) room.player[t].spellTable.pop();

  }
  else {
    let error = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.INVALID_INDEX
      }
    };
    sendJson(error, userId);
  }
}


function endTurn(id, userId, roomCode) {
  let room = roomInfo[roomCode];
  room.consecutiveEnd ++;
  room.turn = 1 - room.turn;
  if (room.consecutiveEnd === 2) {
    endRound(roomCode);
  }
  let ok = {
    id: id,
    responseType: RESPONSE_TYPE.OK,
    data: {}
  };
  sendJson(ok, userId);
  broadcastGameState(roomCode);
}

function Continue(id ,userId, roomCode) {
  let room = roomInfo[roomCode];
  if (room.turn === ROUND_END && room.round !== GAME_END) {
    for (let p of room.player) if (p.user === userId) p.ready = 1;
    
    let ok = {
      id: id,
      responseType: RESPONSE_TYPE.OK,
      data: {}
    };
    sendJson(ok, userId);
    
    if (room.player[0].ready === 1 && room.player[1].ready === 1) {

      if (room.round === GAME_END) {
        startGame(roomCode);
      }
      else {
        startRound(roomCode);
      }
      broadcastGameState(roomCode);
    }
  }
  else return {
    responseType: RESPONSE_TYPE.ERROR,
    data: {
      error: ERROR.INVALID_TIME
    }
  };
}

actionHandlers = {}
/* --- SET_USERNAME --- */

function setUsername(id, userId, data) {
  const username = data.username;
  let response = {}

  if (username !== '') {
    userInfo[userId].username = username;
    response = {
      id: id,
      responseType: RESPONSE_TYPE.OK,
      data: {}
    };
  }
  else {
    response = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.EMPTY_USERNAME
      }
    };
  }
  sendJson(response, userId);
}
actionHandlers[ACTION.SET_USERNAME]=setUsername;



/* --- SET_AVATAR --- */

function setAvatar(id, userId, data) {
  const avatar = data.avatar;
  let response = {}

  if (avatar >= 0 && avatar < AVATAR_CNT) {
    userInfo[userId].avatar = avatar;
    response = {
      id: id,
      responseType: RESPONSE_TYPE.OK,
      data: {}
    };
  }
  else {
    response = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.INVALID_AVATAR
      }
    };
  }
  sendJson(response, userId);
}
actionHandlers[ACTION.SET_AVATAR]=setAvatar;

/* --- CREATE_ROOM --- */

const alphabet='abcdefghijklmnopqrstuvwxyz0123456789';

function createRoom(id, userId, data) {
  let response = {}
  if (userInfo[userId].room === '') {

    let roomCode = ''
    for (let i=0; i<6; i++) {
      roomCode += alphabet[Math.floor(Math.random()*36)];
    }

    userInfo[userId].room = roomCode;
    initRoom(roomCode);
    addPlayerToRoom(roomCode, userId);

    response = {
      id: id,
      responseType: RESPONSE_TYPE.ROOM_CODE,
      data: {
        roomCode: roomCode
      }
    };
  }
  else {
    response = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.ALREADY_IN_ROOM,
        roomCode: userInfo[userId].room
      }
    };
  }
  sendJson(response, userId);
}
actionHandlers[ACTION.CREATE_ROOM]=createRoom;



/* --- JOIN_ROOM --- */

function joinRoom(id, userId, data) {
  console.log('ok good we at joinRoom');
  let response = {}
  if (userInfo[userId].room === '') {
    console.log('ok good not already in another room');
    let roomCode = data.roomCode;
    if (roomInfo[roomCode] === undefined) {
      response = {
        id: id,
        responseType: RESPONSE_TYPE.ERROR,
        data: {
          error: ERROR.ROOM_NOT_EXIST,
        }
      };
      
      sendJson(response, userId);
    }
    else if (roomInfo[roomCode].player.length === 2) {
      response = {
        id: id,
        response: RESPONSE_TYPE.ERROR,
        data: {
          error: ERROR.ROOM_FULL
        }
      };
      
      sendJson(response, userId);
    }
    else {
      
      console.log('ok good room exists and is not full');
      addPlayerToRoom(roomCode, userId);
      
      console.log('added player');
      userInfo[userId].room = roomCode;
      startGame(roomCode);
      console.log('started game, now broadcast dat state pls');

      response = {
        id: id,
        response: RESPONSE_TYPE.OK,
        data: {}
      }
      sendJson(response, userId);
      broadcastGameState(roomCode);
    }
  }
  else {
    response = {
      id: id,
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.ALREADY_IN_ROOM,
        roomCode: userInfo[userId].room
      }
    };
    sendJson(response, userId);
  }
}
actionHandlers[ACTION.JOIN_ROOM]=joinRoom;



/* --- PLAY_MOVE --- */

function playMove(id, userId, data) {
  let response = {};
  console.log(userId);
  console.log(JSON.stringify(userInfo[userId]));
  console.log(JSON.stringify(roomInfo[userInfo[userId].room]));

  const roomCode = userInfo[userId].room;
  if (roomCode === "") {
    let error = {
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROE.NOT_IN_GAME
      }
    };
    sendJson(error,userId);
    return;
  }
  const room = roomInfo[roomCode];
  if ((data.moveType !== MOVE_TYPE.CONTINUE) && (room.turn === ROUND_END || room.player[room.turn].user !== userId)) {
    response = {
      responseType: RESPONSE_TYPE.ERROR,
      data: {
        error: ERROR.NOT_YOUR_TURN
      }
    };
    sendJson(response, userId);
  }
  else {
    switch (data.moveType) {
      case MOVE_TYPE.DRAW: 
        draw(id, userId, roomCode);
        break;
      case MOVE_TYPE.PLAY_SPELL: 
        playSpell(id, userId, roomCode, data.cardIndex);
        break;
      case MOVE_TYPE.END_TURN:
        endTurn(id, userId, roomCode);
        break;
      case MOVE_TYPE.CONTINUE:
        Continue(id, userId, roomCode);
        break;
      default:
        response = {
          responseType: RESPONSE_TYPE.ERROR,
          data: {
            error: ERROR.UNKNOWN_MOVE_TYPE
          }
        };
        sendJson(response, userId);
        break;
    }
  }
}
actionHandlers[ACTION.PLAY_MOVE]=playMove;

/* --- End of actual logic --- */

/* --- WEBSOCKET --- */

function handleMessage(message, userId) {
  const json = JSON.parse(message.toString());


  console.log("Received:");
  console.log(JSON.stringify(json, null, 2));
  console.log("from:");
  console.log(userId);
  console.log(userInfo[userId].username);
  console.log("-------------------------------------------------------------------");

  let handler = actionHandlers[json.action]
  handler(json.id, userId, json.data);
}

function handleDisconnect(userId) {
  console.log(`${userId} disconnected.`);
  delete clients[userId];
  delete userInfo[userId];
}


// A new client connection request received
wsServer.on('connection', function(connection) {
  // Generate a unique code for every user
  const userId = uuidv4();
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  clients[userId] = connection;
  userInfo[userId] = {};
  userInfo[userId].username = userId;
  userInfo[userId].room = '';
  console.log(`${userId} connected.`);

  connection.on('message', (message) => handleMessage(message, userId));
  connection.on('close', ()=>handleDisconnect(userId));

});


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