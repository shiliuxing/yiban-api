const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Record = new Schema({
  "time": { type: Number, require: true },
  "owner": { type: ObjectId, require: true, ref:'User' }
});

/**
 * 新增一个签到记录
 * obj.time 签到时间戳，单位毫秒
 * obj.owner 记录拥有者
 * callback 回调函数
 */
Record.statics.save = function(obj, callback){
  const record = new this(obj);
  record.save(err => {
    err ? callback({done:false,data:'添加记录失败，请稍后重试'}) : callback({done:true,data:record});
  });
}

/**
 * 根据记录拥有者删除记录
 * obj.owner 记录拥有者
 * callback 回调函数
 */
Record.statics.deleteByOwner = function(obj, callback) {
  this
    .remove({owner:obj.owner})
    .exec((err, data) => {
      err ? callback({done:false,data:'删除记录失败，请稍后重试'}) : callback({done:true,data:data});
    })
}

/*
// 新增一个记录
Log.statics.save = function(obj, callback){
  const log = new this(obj);
  log.save(err => {
    err ? callback({done:false,data:err}) : callback({done:true,data:log})
  });
}

// 根据时间戳和用户名查签到记录
Log.statics.findByTime = function(obj, callback){
  const query = {};
  const {startTime,endTime} = getTimeRange(obj.time);
  query['time'] = {$gte:startTime,$lt:endTime};
  obj.owner ? (query['owner'] = obj.owner) : null;

  this
    .find(query)
    .populate('owner')
    .exec((err, data) => {
      err ? callback({done:false,data:err}) : callback({done:true,data:data});  
    })

}
*/


/**
 * 根据起始日期和拥有者查询签到记录
 */

/*
Log.statics.findByDate = function(obj, callback){
  const query = {};
  obj.start ? (query['time']['$gte'] = obj.start) : null;
  obj.end ? (query['time']['$lt'] = obj.end) : null;
  obj.id ? (query['owner'] = obj.id) : null;
  this
    .find(query)
    .populate('owner')
    .exec((err, data) => {
      err ? callback({done:false,data:err}) : callback({done:true,data:data});
    });
}
*/

/**
 * 根据用户id查找记录
 */
/*
Log.statics.findByUserId = function(obj, callback){
  this
    .find({owner:obj.id})
    .populate('owner')
    .exec((err, data) => {
      err ? callback({done:false,data:err}) : callback({done:true,data:data});
    })
}
*/

/**
 * 根据 owner 删除记录
 * obj 含有 owner 属性
 */
 /*
Log.statics.deleteByOwner = function(obj, callback) {
  this
    .remove({owner:obj.owner})
    .exec((err, data) => {
      err ? callback({done:false,data:err}) : callback({done:true,data:data});
    })
}
*/

/**
 * 根据id删除记录
 */
 /*
Log.statics.deleteById = function(obj, callback) {
  this
    .remove({_id:obj.id})
    .exec((err, data) => {
      err ? callback({done:false,data:err}) : callback({done:true,data:data});
    })
}
*/

/**
 * 修改记录
 */
 /*
Log.statics.modifyRecord = function(obj, callback) {

  // 修改签到人 或者 同时修改签到人和签到时间
  if(obj.studentId){

    User.findByStudentId(obj.studentId, (result) => {
      if(result.done && result.data){
        // 查找成功
        const json = { owner: result.data._id };
        obj.time ? (json['time'] = obj.time) : null;
        this
          .where({_id: obj.id})
          .update(json)
          .exec((err, data) => {
            err ? callback({done:false,data:err}) : callback({done:true,data:data});
          })
      }else{
        // 查找失败
        callback({done:false,data:result.data});
      }
    });

  // 修改签到时间
  }else if(obj.time){

    this
      .where({_id: obj.id})
      .update({time: obj.time})
      .exec((err, data) => {
        err ? callback({done:false,data:err}) : callback({done:true,data:data});
      })


  }else{
    callback({done:false,data:"参数缺失"});
  }

}
*/
/**
 * 获取时间戳范围
 * time 时间戳
 */
 /*
function getTimeRange(time){
  const dTime = new Date(time);
  const formatTime = dTime.getFullYear() + '-' + (dTime.getMonth() + 1) + '-' + dTime.getDate();
  const startTime = new Date(formatTime).getTime() - 28800000; // unix时间戳默认认为凌晨8点才算一天的开始，此处减去这8个小时
  return {
    startTime: startTime,
    endTime: startTime + 86400000
  }
}
*/
module.exports = mongoose.model('Record',Record);