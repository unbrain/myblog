const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()
//模板目录 模板引擎 ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

//session 中间件
app.use(session({
  //session id 的字段名称
  name: config.session.key,
  //产生 signedCookie 防篡改
  secret: config.session.secret,
  //强制更新 session
  resave: true,
  //创建 session 即使未登录
  saveUninitialized: false,
  //过期时间
  cookie:{
    maxAge: config.session.maxage
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))

//flash 中间件
app.use(flash())

routes(app)

app.listen(config.port, function () {
  console.log(`${pkg.name} listen on port ${config.port}`)

})