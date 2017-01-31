const Activity = require('../models/activity');
const Util = require('../utils/util');

const idReg = /^[0-9a-fA-F]{24}$/;

// 新增活动
exports.addActivity = (req, res) => {
  const start = req.body.start;
  const end = req.body.end;
  const name = req.body.name;
  const machine = req.body.machine;

  // 校验参数数量
  if( !(start && end && name && machine) ){
    res.json({code:1,msg:'参数缺失'});
    return;
  }

  // 校验cron表达式
  if( !(Util.checkCron(start) && Util.checkCron(end)) ){
    res.json({code:1,msg:'cron表达式不合法'});    
    return;
  }

  // 校验机器id是否合法
  if( !machine.match(idReg) ){
    res.json({code:1,msg:'机器id格式错误'});
    return;
  }

  addActivity({start,end,name,machine},result => {
    res.json(result);
  });

}

// 删除活动
exports.deleteActivity = (req, res) => {
  const id = req.params.id;

  if(id && id.match(idReg)){
    deleteActivity(id,(result)=>{
      res.json(result);
    })
  }else{
    res.status(404).json({code:1,msg:'没有该活动'});
  }
}

// 修改活动
exports.modifyActivity = (req, res) => {
  const start = req.body.start;
  const end = req.body.end;
  const name = req.body.name;
  const machine = req.body.machine;

  const id = req.params.id;

  // 校验 id
  if(id && !id.match(idReg)){
    res.status(404).json({code:1,msg:'没有该活动'});
    return;
  }

  // 参数检测
  if( !(start || end || name || machine) ){
    res.json({code:1,msg:'缺失参数'});
    return;
  }

  // 校验cron表达式
  if( (start && !(Util.checkCron(start))) || (end && !(Util.checkCron(end))) ){
    res.json({code:1,msg:'cron表达式不合法'});    
    return;
  }

  deleteActivity(id,(result, data) => {
    if(!result.code){
      let newInfo = Object.assign({},data._doc,getActivityObj(start,end,name,machine));
      console.log(newInfo)
      addActivity(newInfo, result => {
        if(!result.code){
          res.json(result);
        }else{
          addActivity(data._doc, a => {
            res.json(result);
          })
        }
      });
    }else{
      res.json(result);
    }
  })

}

// 查找活动
exports.getActivity = (req, res) => {
  const lastId = req.query.lastId;
  const count = parseInt(req.query.count);

  // 校验 id
  if(lastId && !lastId.match(idReg)){
    res.json({code:1,msg:'id格式错误'});
    return;
  }

  const info = {};
  lastId ? (info['lastId'] = lastId) : null;
  count ? (info['count'] = count) : null;

  Activity.findActivity(info, result => {
    if(result.done){
      res.json({
        code:0,
        msg:'查找成功',
        number: result.data.length,
        activities: result.data.map(handlerActivity)
      });
    }else{
      res.json({code:1,msg:result.data});
    }
  });
}

// 根据活动获取活动信息
exports.getActivityByName = (req, res) => {
  const name = req.params.name;
  console.log('活动名:',name);

  Activity.findByName({
    name: name
  }, result => {
    console.log('result:',result);
    if(result.done){
      res.json({
        code:0,
        msg:'查找成功',
        activity: {
          id: result.data._id,
          start: result.data.start,
          end: result.data.end,
          name: result.data.name,
          machine: result.data.machine.mark
        }
      })
    }else{
      res.json({code:1,msg:result.data});
    }
  })
}

function getActivityObj(start, end, name, machine) {
  let obj = {};
  start ? (obj['start']=start) : null;
  end ? (obj['end']=end) : null;
  name ? (obj['name']=name) : null;
  machine ? (obj['machine']=machine) : null;
  return obj;
}

// 删除活动
function deleteActivity(id, callback, act=false){
  Activity.findById({
    id:id
  }, result => {
    if(result.done){
      const data = result.data;
      Activity.deleteById({
        id:id
      }, result => {
        if(result.done){
          callback({code:0,msg:'删除成功'},data);
        }else{
          callback({code:1,msg:result.data});
        }
      });

    }else{
      callback({code:1,msg:result.data});
    }
  });
}

// 新增活动
function addActivity(obj, callback){
  // 查找是否已经有该活动
  Activity.findByName({
    name: obj.name.trim()
  }, result => {
    if(result.done){
      if(result.data){
        callback({code:1,msg:'已经有该活动'});
      }else{
        // 查找绑定该活动的机器的其他活动
        Activity.findByMachine({
          machine: obj.machine
        }, result => {
          if(result.done){
            if(Util.hasConflict(obj,result.data)){
              callback({code:1,msg:'当前活动与该机器绑定的其他活动时间上有冲突'});
            }else{
              // 保存活动
              Activity.save(obj, result => {
                if(result.done){
                  callback({code:0,msg:'保存成功',id:result.data._id});
                }else{
                  callback({code:1,msg:result.data});
                }
              })
            }
          }else{
            callback({code:1,msg:result.data});
          }
        })
      }
    }else{
      callback({code:1,msg:result.data});
    }
  })
}

/**
 * 过滤用户信息，将查找到的用户信息处理成接口需要的形式
 * userInfo 存放用户信息的json对象
 * 返回处理后的json对象
 */
function handlerActivity(info){
  return {
    id: info._id,
    start: info.start,
    end: info.end,
    name: info.name,
    machine: info.machine.mark
  }
}
