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
      console.log(data);
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

// 根据id查找用户
User.statics.findById = function(id, callback){
  this.findOne({_id:id}, 'realname studentId', (err, person) => {
    err ? callback({done:false,data:err}) : callback({done:true,data:person});
  })
}

// 根据学号查找用户
User.statics.findByStudentId = function(id, callback){
  this.findOne({studentId:id}, '_id', (err, person) => {
    err ? callback({done:false,data:err}) : callback({done:true,data:person});
  });
}

/**
 * 查找用户
 * obj 用户信息的json对象
 */
User.statics.findByPerson = function(obj, callback){
  const query = {};
  obj.realname ? (query['realname'] = obj.realname) : null;
  obj.studentId ? (query['studentId'] = obj.studentId) : null;
  this.find(query, 'realname studentId', (err, person) => {
    err ? callback({done:false, data:err}) : callback({done:true, data:person});
  })
}

/**
 * 添加用户
 * obj 用户信息的 json 对象，包括 studentId, realname
 */
User.statics.addUser = function(obj, callback) {
  this
    .findOne({
      studentId: obj.studentId
    })
    .exec((err, data) => {
      if(err){
        callback({done:false,data:err});
      }else{
        if(data){
          // 找到该用户
          callback({done:false,data:data});
        }else{
          // 没找到该用户
          const user = new this(obj);

          user.save(err => {
            err ? callback({done:false,data:err}) : callback({done:true,data:user});
          });
        }
      }
    });

}

/**
 * 删除用户
 * obj 用户信息的 json 对象，有 id 属性
 */
User.statics.deleteById = function(obj, callback) {
  this
    .remove({
      _id: obj.id
    })
    .exec((err, data) => {
      if(err){
        callback({done:false,data:err,msg:"删除用户出错"});
      }else{
        callback({done:true,data:data,msg:"删除用户成功"});
      }
    })
}

module.exports = mongoose.model('User', User);
