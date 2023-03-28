const bodyParser = require('body-parser');
const app = require('express')();
const socket = require('socket.io');
const users = require('./users')();

let server = null;
let io = null;

app.use(bodyParser.json());

app.all('/init', (req, res) => {
  if(!server) {
    server = res.socket.server;
    io = socket(server);

    io.on('connection', function(socket) {
      console.log('IO connected');

      socket.on('userJoined', (data, callback) => {
        if(!data.name || !data.room) {
          return callback('Invalid data');
        }
        
        socket.join(data.room);

        users.remove(socket.id);
        users.add({
          id: socket.id,
          name: data.name,
          room: data.room,
        });

        callback({userId: socket.id});
        io.to(data.room).emit('updateUsers', users.getByRoom(data.room));

        socket.emit('newMessage', {
          name: 'admin',
          text: `Welcome, ${data.name}`,
        })

        socket.broadcast.to(data.room)
          .emit('newMessage', {
            name: 'admin',
            text: `User ${data.name} joined the room`,
          });
      })

      socket.on('createMessage', (data, callback) => {
        if(!data.text) {
          return callback('Text is empty');
        }

        const user = users.get(data.id);
        if(user) {
          io.to(user.room).emit('newMessage', {
            name: user.name,
            text: data.text,
            id: data.id,
          })
        }
        callback();
      })

      socket.on('userLeft', (id, callback) => {
        const user = users.remove(id);
        if(user) {
          io.to(user.room).emit('updateUsers', users.getByRoom(user.room));
          io.to(user.room).emit('newMessage', {
            name: 'admin',
            text: `User ${user.name} left the room`,
          })
        }
        callback();
      })

      socket.on('disconnect', () => {
        console.log('IO disconnected');

        const user = users.remove(socket.id);
        if(user) {
          io.to(user.room).emit('updateUsers', users.getByRoom(user.room));
          io.to(user.room).emit('newMessage', {
            name: 'admin',
            text: `User ${user.name} left the room`,
          })
        }
      })
    })
  }

  res.json({msg: 'server is set'});
})

app.get('/hello', (req, res) => res.status(200).json([{greeting: "Hello"}, {name: "User"}]))

module.exports = app;