const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()

app.use(express.static(path.join(__dirname, '../static')))

const todos = [{
  text: 'todo1',
  completed: false,
  id: 0,
}, {
  text: 'todo2',
  completed: true,
  id: 1,
}, {
  text: 'todo3',
  completed: true,
  id: 2,
}, {
  text: 'todo4',
  completed: false,
  id: 3,
}, {
  text: 'todo5',
  completed: false,
  id: 4,
}, {
  text: 'todo6',
  completed: true,
  id: 5,
}];

app.get('/initial_todos', (req, res) => {
  res.send({
    todos,
  })
})

const server = http.createServer(app)

module.exports = server
