const server = require('./app')
const dispatch = require('./dispatch')

server.listen(4000, () => {
  dispatch()
})

console.log("Listening on port 4000...")
