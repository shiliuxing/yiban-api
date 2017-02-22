const Auth = require('../models/auth');
const decrypt = require('../utils/decrypt');

// 登录
exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(req.session.logined){
    res.json({code:1,msg:'已经登录'});
    return;
  }

  if( !(username && password) ){
    res.json({code:0,msg:'缺失参数'});
    return;
  }

  Auth.findByUsername({
    username: username.trim()
  },result => {
    if(result.done){
      if(result.data.password === decrypt.md5(password.trim())){
        req.session.user = username;
        req.session.logined = true;
        res.json({code:0,msg:'登录成功'})
      }else{
        res.json({code:1,msg:'用户名或密码错误'});
      }
    }else{
      res.json({code:1,msg:result.data});
    }
  })
}

// 退出
exports.logout = (req, res) => {
  req.session.logined = false;
  res.json({code:0,msg:'退出成功'});
}
