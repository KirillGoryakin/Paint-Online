const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 5000;

let rooms = []; //[{ id: number, users: string[], figures: Figure[] }, ...]

app.ws('/', (ws, req) => {
  console.log('A user connected!');
  
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);

    switch (msg.method) {
      case 'connection': handleConnection(ws, msg); break;
      case 'disconnection': handleDisconnection(ws, msg); break;
      case 'figure': handleFigure(ws, msg); break;
      case 'undo': handleUndo(ws, msg); break;
    }
  });
});

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const response = { id: roomId, users: [] };

  if (roomId) {
    const room = rooms.find(({ id }) => id === roomId);
    if (room) {
      return res.json({...response, users: room.users});
    }
  }

  return res.json(response);
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));

const sendToUser = (id, username, msg) => {
  msg = { ...msg, id, username };
  
  aWss.clients.forEach(client => {
    if (client.id === id & client.username === username) {
      client.send(JSON.stringify(msg));
    }
  });
};

const sendToAllUsersInRoom = (msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};

const handleConnection = (ws, msg) => {
  ws.id = msg.id;
  ws.username = msg.username;

  const room = rooms.find(room => room.id === msg.id);
  if (room) {
    room.users.push(msg.username);
    sendToAllUsersInRoom({ ...msg, users: room.users });
    sendToUser(msg.id, msg.username, { method: 'init', figures: room.figures });
  } else {
    const newRoom = {
      id: msg.id,
      figures: [],
      users: [msg.username]
    };
    rooms.push(newRoom);
    sendToAllUsersInRoom({ ...msg, users: newRoom.users });
  }
};

const handleDisconnection = (ws, msg) => {
  console.log('A user has disconnected!');

  const room = rooms.find(({ id }) => id === msg.id);
  if(room){
    if (room.users.length > 1) {
      room.users = room.users.filter(user => user !== msg.username);
      sendToAllUsersInRoom({ ...msg, users: room.users });
    } else {
      rooms = rooms.filter(({ id }) => id !== room.id);
    }
  }
};

const handleFigure = (ws, msg) => {
  const room = rooms.find(({ id }) => id === msg.id);
  if (room)
    room.figures.push(msg.figure);

  sendToAllUsersInRoom(msg);
};

const handleUndo = (ws, msg) => {
  const room = rooms.find(({ id }) => id === msg.id);
  if (room) room.figures.pop();

  sendToAllUsersInRoom(msg);
};