const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Auth = new Schema({
  "username": { type: String, require: true },
  "password": { type: String, require: true }
});

/**
 * 根据用户名查找用户信息
 * obj.username 用户名
 * callback 回调函数
 */
Auth.statics.findByUsername = function(obj, callback){
  this
    .findOne({username: obj.username})
    .exec((err, data) => {
      if(!err){
        callback({done:true,data:data});
      }else{
        callback({done:false,data:'查找失败，请稍后重试'});
      }
    })

}

module.exports = mongoose.model('Auth', Auth);
