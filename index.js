const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const restc = require('restc');
const cors = require('cors');
const jwt = require('express-jwt');

const { secret,mongodb,webUrl,port } = require('./config');

const machine = require('./routes/machine');
const user = require('./routes/user');
const record = require('./routes/record');
const activity = require('./routes/activity');
const auth = require('./routes/auth');

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

app.use(cookieParser());

// 解析请求体中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// cors配置
const corsOptions = {
  origin: webUrl,
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));


const getToken = (req) => {
  return req.cookies.token;
}

// 路由
app.use(jwt({secret,getToken}).unless({path:['/auth/login']}));
app.use('/machine', machine);
app.use('/user', user);
app.use('/record', record);
app.use('/activity', activity);
app.use('/auth', auth);

// token error handler
app.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError'){
    res.status(401).send({code:1,msg:'invalid token'});
  }
})

// 404
app.use((req, res) => {
  res.status(404).send({code:1,msg:'page not fount'});
});

// 监听端口
app.listen(port, () => {
  console.log('app listening on port ' + port);
});
