const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Activity = new Schema({
  "start": { type: String, require: true },
  "end": { type: String, require: true },
  "name": { type: String, require: true, unique: true },
  "machine": { type: ObjectId, require: true, ref:'Machine' },
});

/**
 * 新增活动
 * obj.start 签到开始时间
 * obj.end 签到结束时间
 * obj.name 活动名称
 * obj.machine 活动绑定的机器id
 * callback 回调函数
 */
Activity.statics.save = function(obj, callback) {
  const activity = new this(obj);
  activity.save(err => {
    err ? callback({done: false,data: '添加失败，请稍后重试'}) : callback({done: true,data: activity});
  });
}

/**
 * 根据id查找活动
 * obj.id 活动id
 * callback 回调函数
 */
Activity.statics.findById = function(obj, callback) {
  this
    .findOne({_id:obj.id})
    .populate('machine')
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      }else if(data){
        callback({done:true,data:data});
      }else{
        callback({done:false,data:'没有该活动'});
      }
    })
}

/**
 * 根据活动名查找活动
 * obj.name 活动名
 * callback 回调函数
 */
Activity.statics.findByName = function(obj, callback) {
  this
    .findOne({name:obj.name})
    .populate('machine')
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      }else{
        callback({done:true,data:data});
      }
    })
}

/**
 * 根据机器id查找活动
 * obj.machine 机器id
 * callback 回调函数
 */
Activity.statics.findByMachine = function(obj, callback) {
  this
    .find({machine:obj.machine})
    .populate('machine')
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找失败，请稍后重试'});
      }else{
        callback({done:true,data:data});
      }
    })
}

/**
 * 根据id删除活动
 * obj.id 活动id
 * callback 回调函数
 */
Activity.statics.deleteById = function(obj, callback) {
  this
    .remove({_id:obj.id})
    .exec((err, data) => {
      err ? callback({done:false,data:'删除失败，请稍后重试'}) : callback({done:true,data:data});
    })
}

/**
 * 查找活动
 * obj.lastId 从该id开始查找 可选
 * obj.count 查找数量 可选
 * callback 回调函数
 */
Activity.statics.findActivity = function(obj, callback) {
  const query = obj.lastId ? { _id:{$gt:obj.lastId} } : {};
  const count = obj.count ? obj.count : 20;

  this
    .find(query)
    .limit(count)
    .populate('machine')
    .sort({_id:1})
    .exec((err, data) => {
      if(err){
        callback({done:false,data:'查找活动出错，请稍后重试'});
      }else{
        callback({done:true,data:data});
      }
    })
}

module.exports = mongoose.model('Activity', Activity);
