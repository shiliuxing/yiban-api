const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Machine = new Schema({
  "code": { type: String, require: true },
  "mark": { type: String, require: true}
});

/**
 * 新增机器
 * obj.code 机器码
 * obj.mark 机器备注
 * callback 回调函数
 */
Machine.statics.save = function(obj, callback){
  this
    .findOne({code:obj.code})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'添加失败，请稍后重试'});
      }else{
        if(data){
          // 已经存在该机器
          callback({done:false,data:'已经存在该机器'});
        }else{
          // 数据库中没有该机器
          const machine = new this(obj);
          machine.save(err => {
            err ? callback({done:false,data:'添加失败，请稍后重试'}) : callback({done:true,data:machine});
          });
        }  
      }
    })

}

/**
 * 根据id查找机器
 * obj.id 机器id
 * callback 回调函数
 */
Machine.statics.findById = function(obj, callback) {
  this
    .findOne({_id:obj.id})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      }else if(data){
        callback({done:true,data:data});
      }else{
        callback({done:false,data:'没有该机器'});
      }
    })
}

/**
 * 根据id删除机器
 * obj.id 机器id
 * callback 回调函数
 */
Machine.statics.deleteById = function(obj, callback) {
  this
    .remove({_id:obj.id})
    .exec((err, data) => {
      err ? callback({done:false,data:'删除失败，请稍后重试'}) : callback({done:true,data:data});
    })

}

/**
 * 更新机器信息
 * obj.id 机器id 必填
 * obj.code 机器码 可选
 * obj.mark 机器备注 可选
 * callback 回调函数
 */
Machine.statics.updateInfo = function(obj, callback) {
  const newObj = {};
  obj.code ? (newObj['code'] = obj.code) : '';
  obj.mark ? (newObj['mark'] = obj.mark) : '';
  
  this
    .where({_id:obj.id})
    .update(newObj)
    .exec((err, data) => {
      err ? callback({done:false,data:'更新失败，请稍后重试'}) : callback({done:true,data:data});
    })
}


/**
 * 获得所有机器信息
 * callback 回调函数
 */
Machine.statics.findAll = function(callback){
  this
    .find({})
    .exec((err,data) => {
      err ? callback({done:false,data:'查找失败，请稍后重试'}) : callback({done:true,data:data});
    })
}


module.exports = mongoose.model('Machine', Machine);
