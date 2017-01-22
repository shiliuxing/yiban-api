const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = new Schema({
  "realname": { type: String, require: true },
  "studentId": { type: String, require: true }
});




/**
 * 新增用户
 * obj.studentId 学号
 * obj.realname 姓名
 * callback 回调函数
 */
User.statics.save = function(obj, callback){
  this
    .findOne({studentId:obj.studentId})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      } else {
        if(data){
          callback({done:false,data:'已有该用户'});
        }else{
          const user = new this(obj);
          user.save(err => {
            err ? callback({done:false,data:'新增失败，请稍后重试'}) : callback({done:true,data:user});
          })
        }
      }
    })
}

/**
 * 根据id查找用户
 * obj.id 用户id
 * callback 回调函数
 */
User.statics.findById = function(obj, callback){
  this
    .findOne({_id:obj.id})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      }else if(data){
        callback({done:true,data:data});
      }else{
        callback({done:false,data:'没有该用户'});
      }
    })
}

/**
 * 根据id删除用户
 * obj.id 用户id
 * callback 回调函数
 */
User.statics.deleteById = function(obj, callback) {
  this
    .remove({_id:obj.id})
    .exec((err, data) => {
      err ? callback({done:false,data:'删除失败，请稍后重试'}) : callback({done:true,data:data});
    })
}

/**
 * 更新用户信息
 * obj.id 用户id 必填
 * obj.studentId 可选
 * obj.realname 可选
 * callback 回调函数
 */
User.statics.updateInfo = function(obj, callback){
  const newObj = {};
  obj.studentId ? (newObj['studentId'] = obj.studentId) : '';
  obj.realname ? (newObj['realname'] = obj.realname) : '';
  
  this
    .where({_id:obj.id})
    .update(newObj)
    .exec((err, data) => {
      err ? callback({done:false,data:'更新用户信息失败，请稍后重试'}) : callback({done:true,data:data});
    })
}

/**
 * 查找用户
 * obj.lastId 从该id开始查找 可选
 * obj.count 查找数量 可选
 * callback 回调函数
 */
User.statics.findUser = function(obj, callback) {
  const query = obj.lastId ? { _id:{$gt:obj.lastId} } : {};
  const count = obj.count ? obj.count : 20;

  this
    .find(query)
    .limit(count)
    .sort({_id:1})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找用户出错，请稍后重试'});
      }else{
        callback({done:true,data:data});
      }
    })
}


module.exports = mongoose.model('User', User);
