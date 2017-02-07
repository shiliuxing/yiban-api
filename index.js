const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const restc = require('restc');
const cors = require('cors');

const {
  secret,
  cookieTime,
  port,
  mongodb,
  webUrl
} = require('./config');

const machine = require('./routes/machine');
const user = require('./routes/user');
const record = require('./routes/record');
const activity = require('./routes/activity');

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(mongodb);
mongoose.connection.on('connected', () => console.log('Mongoose default connection open to ' + mongodb));
mongoose.connection.on('error', (err) => console.log(err));

const app = express();

// 信任代理
app.enable('trust proxy');

// restc 中间件
app.use(restc.express());

// 解析请求体中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// session 中间件
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: cookieTime
  }
}));

// cors配置
const corsOptions = {
  origin: config.webUrl,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// 路由
app.use('/machine', machine);
app.use('/user', user);
app.use('/record', record);
app.use('/activity', activity);

// 404
app.use((req, res) => {
  res.status(404).send('404');
});

// 监听端口
app.listen(port, () => {
  console.log('app listening on port ' + port);
});
