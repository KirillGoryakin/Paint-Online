const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 5000;

/*
  type Rooms = {
    [roomId: string]: {
      roomId: string;
      users: string[];
      figures: Figure[];
    }
  };
*/
// let rooms = {};
let rooms = {};

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);

    switch (msg.method) {
      case 'connection': handleConnection(ws, msg); break;
      case 'figure': handleFigure(msg); break;
      case 'undo': handleUndo(msg); break;
    }
  });

  ws.on('close', () => handleDisconnection(ws));
});

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const response = { roomId, users: [] };

  if (roomId) {
    const room = rooms[roomId];
    if (room) {
      return res.json({...response, users: room.users});
    }
  }

  return res.json(response);
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));

const logRooms = () => {
  let toLog = {};
  for( const roomId in rooms ){
    toLog[roomId] = rooms[roomId].users;
  }
  console.log('Rooms: ', toLog);
};

const sendToUser = (roomId, username, msg) => {
  msg = { ...msg, roomId, username };
  
  aWss.clients.forEach(client => {
    if (client.roomId === roomId & client.username === username) {
      client.send(JSON.stringify(msg));
    }
  });
};

const sendToAllUsersInRoom = (roomId, msg) => {
  aWss.clients.forEach(client => {
    if (client.roomId === roomId) {
      client.send(JSON.stringify(msg));
    }
  });
};

const handleConnection = (ws, msg) => {
  console.log(`${msg.username} has connected to {${msg.roomId}}! (${new Date().toGMTString()})`);

  ws.roomId = msg.roomId;
  ws.username = msg.username;

  const room = rooms[msg.roomId];
  if (room) {
    room.users.push(msg.username);
    sendToAllUsersInRoom(msg.roomId, { ...msg, users: room.users });
    sendToUser(msg.roomId, msg.username, { method: 'init', figures: room.figures });
  } else {
    rooms[msg.roomId] = {
      roomId: msg.roomId,
      figures: [],
      users: [msg.username]
    };
    sendToAllUsersInRoom(msg.roomId, { ...msg, users: [msg.username] });
  }

  logRooms();
};

const handleDisconnection = (ws) => {
  console.log(`${ws.username} has disconnected from {${ws.id}}! (${new Date().toGMTString()})`);

  const room = rooms[ws.roomId];
  if (room) {
    if (room.users.length > 1) {
      room.users = room.users.filter(user => user !== ws.username);
      sendToAllUsersInRoom(ws.roomId, {
        method: 'disconnection',
        users: room.users
      });
    } else {
      delete rooms[ws.roomId];
    }
  }

  logRooms();
};

const handleFigure = (msg) => {
  const room = rooms[msg.roomId];
  if (room){
    if (!msg.figure.pending)
      room.figures.push(msg.figure);

    sendToAllUsersInRoom(msg.roomId, msg);
  }
};

const handleUndo = (msg) => {
  const room = rooms[msg.roomId];
  if (room) room.figures.pop();

  sendToAllUsersInRoom(msg.roomId, msg);
};