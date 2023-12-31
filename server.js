
const Koa = require('koa')
const fs = require('fs');
const https = require('https');
const path = require('path')
const koaSend = require('koa-send')
const static = require('koa-static')
const socket = require('socket.io')
const users = {} // 保存用户
const sockS = {} // 保存客户端对应的socket
// const io = new socket({
//   ioOptions: {
//     pingTimeout: 10000,
//     pingInterval: 5000,
//   },
// })

const certificate = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./mydomain.crt')
};

// 创建一个Koa对象表示web app本身:
const app = new Koa()
// // socket注入应用
// io.attach(app)

app.use(static(path.join(__dirname, './public')))

const serve = https.createServer(certificate, app.callback());

serve.listen(3002, () => {
    console.log(`server running success at 3002`)
});

const io = socket.listen(serve);

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  if (!/\./.test(ctx.request.url)) {
    await koaSend(
      ctx,
      'index.html',
      {
        root: path.join(__dirname, './'),
        maxage: 1000 * 60 * 60 * 24 * 7,
        gzip: true,
      } // eslint-disable-line
    )
  } else {
    await next()
  }
})
// io.on('join', ctx=>{ // event data socket.id
// });
io.on('connection', sock => {
  sock.on('join', data => {
    console.log('加入进来了')
    console.log(data)
    sock.join(data.roomid, () => {
      if (!users[data.roomid]) {
        users[data.roomid] = []
      }
      let obj = {
        account: data.account,
        id: sock.id,
      }
      let arr = users[data.roomid].filter(v => v.account === data.account)
      if (!arr.length) {
        users[data.roomid].push(obj)
      }
      sockS[data.account] = sock
      io.in(data.roomid).emit('joined', users[data.roomid], data.account, sock.id) // 发给房间内所有人
    })
  })
  sock.on('share', data => {
    console.log('shareed', JSON.stringify(data))
    io.in(data.roomid).emit('shareed', users[data.roomid], data.account, sock.id) // 发给房间内所有人
  })
  sock.on('stop_share', data => {
    console.log('stop_shareed', JSON.stringify(data))
    io.in(data.roomid).emit('shareed', users[data.roomid], data.account, sock.id) // 发给房间内所有人
  })
  sock.on('offer', data => {
    console.log('offer', data);
    sock.to(data.roomid).emit('offer', data)
  })
  sock.on('answer', data => {
    console.log('answer', data);
    sock.to(data.roomid).emit('answer', data)
  })
  sock.on('__ice_candidate', data => {
    // console.log('__ice_candidate', data);
    sock.to(data.roomid).emit('__ice_candidate', data)
  })
  // 有人离开了，就在这个房间列表里删除他
  sock.on('oneLeave', data => {
    if (!users[data.roomid]) {
        users[data.roomid] = []
      }
    users[data.roomid].forEach((v, i) => {
      if (v.account === data.account) {
        users[data.roomid].splice(i, 1)
      }
    })
    console.log(`从房间${data.roomid}删除${data.account}`)
    console.log(users[data.roomid])
    sock.to(data.roomid).emit('oneLeave', users[data.roomid], data)
  })

  // 1 v 1
  sock.on('apply', data => {
    // 转发申请
    sockS[data.account].emit('apply', data)
  })
  sock.on('reply', data => {
    // 转发回复
    sockS[data.account].emit('reply', data)
  })
  sock.on('1v1answer', data => {
    // 转发 answer
    sockS[data.account].emit('1v1answer', data)
  })
  sock.on('1v1ICE', data => {
    // 转发 ICE
    sockS[data.account].emit('1v1ICE', data)
  })
  sock.on('1v1offer', data => {
    // 转发 Offer
    sockS[data.account].emit('1v1offer', data)
  })
  sock.on('1v1hangup', data => {
    // 转发 hangup
    sockS[data.account].emit('1v1hangup', data)
  })
  sock.on('ceshi1', data => {
    console.log('监听个测试')
    console.log(data)
    sockS[data.account].emit('ceshi1huifu', data)
  })
  sock.on('clearAll', data => {
    users[data.roomid] = []
    io.in(data.roomid).emit('clearAll', users[data.roomid], data.account, sock.id) // 发给房间内所有人
  })
})
io.on('disconnect', sock => {
  console.log('disconnect', sock)
  for (let k in users) {
    users[k] = users[k].filter(v => v.id !== sock.id)
  }
//   sock.emit('oneLeave', { roomid: this.roomid, account: this.account })
  console.log(`disconnect id => ${users}`)
})

// 在端口3001监听:
// let port = 3002
// app.listen(port, _ => {
//   console.log('app started at port ...' + port)
// })
// https.createServer(app.callback()).listen(3001);
