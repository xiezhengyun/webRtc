import io from 'socket.io-client'
// let host = 'http://192.168.1.101:3002'
let host = 'https://192.168.21.79:3002'
const socket  = io.connect(host)
export default socket
