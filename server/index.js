const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 5000;

let rooms = []; //[{ id: number, img: string, users: string[] }, ...]

app.ws('/', (ws, req) => {
  console.log('A user connected!');
  
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);

    switch (msg.method) {
      case 'connection': handleConnection(ws, msg); break;
      case 'disconnection': handleDisconnection(ws, msg); break;
      case 'draw': handleDraw(ws, msg); break;
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
    sendToUser(msg.id, msg.username, { method: 'roomImage', dataURL: room.img });
  } else {
    const newRoom = {
      id: msg.id,
      img: '',
      users: [msg.username]
    };
    rooms.push(newRoom);
    sendToAllUsersInRoom({ ...msg, users: newRoom.users });
  }
};

const handleDisconnection = (ws, msg) => {
  console.log('A user has disconnected!');
  ws.id = msg.id;

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

const handleDraw = (ws, msg) => {
  ws.id = msg.id;

  const room = rooms.find(({ id }) => id === msg.id);
  if (room)
    room.img = msg.dataURL;

  sendToAllUsersInRoom(msg);
};
