const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

let rooms = [];

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

app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));

const sendToAllUsersInRoom = (msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  });
};

const handleConnection = (ws, msg) => {
  ws.id = msg.id;

  const room = rooms.find(room => room.id === msg.id);
  if (room) {
    room.users.push(msg.username);
    sendToAllUsersInRoom({ ...msg, users: room.users });
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
  sendToAllUsersInRoom(msg);
};
