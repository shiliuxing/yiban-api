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

  // 查找是否已经有该活动
  Activity.findByName({
    name: name.trim()
  }, result => {
    if(result.done){
      if(result.data){
        res.json({code:1,msg:'已经有该活动'});
      }else{
        
        // 查找绑定该活动的机器的其他活动
        Activity.findByMachine({
          machine: machine
        }, result => {
          if(result.done){
            
            const newActivity = {start,end,name,machine};
            if(Util.hasConflict(newActivity,result.data)){
              res.json({code:1,msg:'当前活动与该机器绑定的其他活动时间上有冲突'});
            }else{
              
              // 保存活动
              Activity.save(newActivity, result => {
                if(result.done){
                  res.json({code:0,msg:'保存成功',id:result.data._id});
                }else{
                  res.json({code:1,msg:result.data});
                }
              })
            }


          }else{
            res.json({code:1,msg:result.data});
          }
        })

      }
    }else{
      res.json({code:1,msg:result.data});
    }
  })

}

// 删除活动
exports.deleteActivity = (req, res) => {
  res.end('deleteActivity');
}

// 修改活动
exports.modifyActivity = (req, res) => {
  res.end('modifyActivity');
}

// 查找活动
exports.getActivity = (req, res) => {
  res.end('getActivity');
}
