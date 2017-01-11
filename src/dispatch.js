const http = require('http')

module.exports = function dispatch() {
  http.get({
    hostname: 'localhost',
    port: 3000,
    path: '/__dispatch',
  }, res => {
    // console.log('res', res)
  }).on('error', (e) => {
    console.log(e);
  });
}
