const Record = require('../models/record');
const User = require('../models/user');
const Activity = require('../models/activity');

const idReg = /^[0-9a-fA-F]{24}$/;

// 新增签到记录
exports.addRecord = (req, res) => {
  const time = parseInt(req.body.time);
  const owner = req.body.owner;
  const activity = req.body.activity;

  if( !(time && owner && activity) ) {
    res.json({code:1,msg:'缺失参数或时间不正确'});
    return;
  }


  if( !(owner.match(idReg) && activity.match(idReg)) ){
    res.json({code:1,msg:'拥有者或活动的id格式不正确'});
    return;
  }

  User.findById({
    id: owner
  }, result => {
    if(result.done){
      Activity.findById({
        id: activity
      }, result => {
        if(result.done){
          Record.save({time,owner,activity},result => {
            if(result.done){
              res.json({code:0,msg:'添加成功',id:result.data._id});
            }else{
              // 添加失败
              res.json({code:1,msg:result.data});
            }
          })
        }else{
          // 没有该活动
          res.json({code:1,msg:result.data});
        }
      })
    }else{
      // 没有该用户
      res.json({code:1,msg:result.data});
    }
  })

}

// 删除签到记录
exports.deleteRecord = (req, res) => {
  const id = req.params.id;

  if( !(id && id.match(idReg)) ){
    res.status(404).json({code:1,msg:"id格式不正确"});
    return;
  }

  Record.deleteById({
    id: id
  }, (result) => {
    if(result.done){
      res.json({code:0,msg:"删除成功"});
    }else{
      // 删除失败
      res.json({code:1,msg:result.data});
    }
  });

}

// 修改签到记录
exports.modifyRecord = (req, res) => {
  const time = Number(req.body.time);
  const owner = req.body.owner;
  const activity = req.body.activity;

  const id = req.params.id;

  if( !(id && id.match(idReg)) ){
    res.status(404).json({code:1,msg:'没有该记录'});
    return;
  }

  // TODO: 校验owner和activity在数据库中存在
  Record.findById({
    id: id
  }, result => {
    if(result.done){
      const newObj = {id:id};
      time ? (newObj['time'] = time) : null;
      owner ? (newObj['owner'] = owner) : null;
      activity ? (newObj['activity'] = activity) : null;

      Record.updateInfo(newObj, result => {
        if(result.done){
          res.json({code:0,msg:'修改成功'});
        }else{
          res.json({code:1,msg:result.data});
        }
      })
    }else{
      res.status(404).json({code:1,msg:result.data});
    }
  })

}

// 查询签到记录
exports.getRecord = (req, res) => {
  const lastId = req.query.lastId;
  const count = Number(req.query.count);

  if( lastId && !lastId.match(idReg) ){
    res.json({code:1,msg:'id格式不正确'});
    return;
  }

  Record.findRecord({lastId,count}, result => {
    if(result.done){
      res.json({
        code: 0,
        msg: '查询成功',
        number: result.data.length,
        records: result.data.map(handlerRecord)
      });
    }else{
      res.json({code:1,msg:result.data});
    }
  })

  /*
  // 有姓名或学号
  } else if (realname || studentId) {

    User.findByPerson({
      realname: realname,
      studentId: studentId
    },(data)=>{
      if(data.done){
        let arr = [];
        let count = 0;
        const persons = data.data;
        for(let i=0;i<persons.length;i++){
          Log.findByDate({
            start: start,
            end: end,
            id:persons[i]._id
          }, (data) => {
            console.log(data)
            arr = arr.concat(data.data);
            count++;
            if(count === persons.length){
              res.json(handleJson(arr));
            }
          })
        }
      }
    });

  // 有日期 没有 姓名或学号
  } else if ((start || end) && !(realname || studentId)) {
    Log.findByDate({
      start: start,
      end: end
    }, (data) => {
      if(data.done){
        res.json(handleJson(data.data));
      }else{
        res.json({"code":1,"msg":"未知错误"});
      }
    })


  }else{
    res.json({"code":1,"msg":"未知错误"});
  }
  */

}


/**
 * 过滤记录信息，将查找到的记录信息处理成接口需要的形式
 * info 存放记录信息的json对象
 * 返回处理后json对象
 */
function handlerRecord(info){
  return {
    id: info._id,
    time: info.time,
    activity: info.activity.name,
    studentId: info.owner.studentId,
    realname: info.owner.realname
  }
}
