const User = require('../models/user');
const Record = require('../models/record');

const idReg = /^[0-9a-fA-F]{24}$/;

// 新增签到记录
exports.addRecord = (req, res) => {
  // const time
}

// 删除签到记录
exports.deleteRecord = (req, res) => {
  const id = req.body.id;

  if(id && id.match(reg)){
    Log.deleteById({
      id: id
    }, (result) => {
      if(result.done){
        // 删除成功
        res.json({code:0,msg:"删除成功"});
      }else{
        // 删除失败
        res.json({code:1,msg:"删除失败"});
      }
    });
  }else{
    res.json({code:1,msg:"参数不合法"});
  }
}

// 修改签到记录
exports.modifyRecord = (req, res) => {
  const id = req.body.id;
  const time = Number(req.body.time);
  const studentId = req.body.studentId;

  if( id && id.match(reg) && (time || studentId) ){
    Log.modifyRecord({
      id: id,
      time: time,
      studentId: studentId
    }, (result) => {
      if(result.done && result.data.nModified){
        res.json({code:0,msg:"修改成功"});
      }else{
        res.json({code:1,msg:"修改失败"});
      }
    })
  }else{
    res.json({code:1,msg:"参数不合法"});
  }
}

// 查询签到记录
exports.getRecord = (req, res) => {
  res.end('getRecord');
  /*
  const start = req.query.start;
  const end = req.query.end;
  const realname = req.query.realname;
  const studentId = req.query.studentId;
  const lastId = req.query.lastId;

  // 所有参数都没有，查询当日签到记录
  if (!start && !end && !realname && !studentId) {

    Log.findByTime({
      time:new Date().getTime()
    }, (data) => {
      res.json(handleJson(data.data));
    })


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
 * 将从数据库中取出来的数据处理成前端需要的格式
 * data 存储签到信息的json数组
 */
function handleJson(data){
  for(let i=0;i<data.length;i++){
    let newJson = {};
    newJson._id = data[i]._id;
    newJson.time = data[i].time;
    newJson.realname = data[i].owner.realname;
    newJson.studentId = data[i].owner.studentId;
    data[i] = newJson;
  }
  return {
    code: 1,
    count: data.length,
    record: data
  }
}