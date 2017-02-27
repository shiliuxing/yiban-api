const Auth = require('../models/auth');
const decrypt = require('../utils/decrypt');
const jwt = require('jsonwebtoken');
const { secret,expires } = require('../config');

// 登录
exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if( !(username && password) ){
    res.json({code:0,msg:'缺失参数'});
    return;
  }

  Auth.findByUsername({
    username: username.trim()
  },result => {
    if(result.done){
      if(result.data && (result.data.password === decrypt.md5(password.trim())) ){
        const token = jwt.sign({id:result.data._id}, secret, {expiresIn:expires});
        res
          .cookie('token',token,{httpOnly:true,expires:new Date(Date.now() + expires*1000)})
          .json({code:0,msg:'登录成功',data:{username:result.data.username,token}});
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
  res.clearCookie('token').json({code:0,msg:'退出成功'});
}

// 刷新token
exports.refreshToken = (req, res, next) => {
  const token = jwt.sign({id:req.user.id}, secret, {expiresIn:expires}); // 1小时，单位秒
  res.cookie('token', token, {httpOnly:true, expires: new Date(Date.now() + expires*1000)}); // 1小时，单位毫秒
  next();
}
