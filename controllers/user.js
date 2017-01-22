const User = require('../models/user');
const Record = require('../models/record');

const idReg = /^[0-9a-fA-F]{24}$/;

// 新增用户
exports.addUser = (req, res) => {
  const studentId = req.body.studentId;
  const realname = req.body.realname;

  if (studentId && realname) {
    User.save({
      studentId: studentId,
      realname: realname
    }, result => {
      if (result.done) {
        res.json({code: 0,msg: '添加成功',id:result.data._id});
      } else {
        res.json({code: 1,msg: result.data});
      }
    });
  } else {
    res.json({code: 1,msg: '缺失参数'});
  }
}





// 删除用户
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  if(id && id.match(idReg)){

    // 确认用户存在
    User.findById({
      id: id
    }, result => {
      if(result.done){
        // 删除用户
        User.deleteById({
          id: id
        }, result => {
          if(result.done){
            // 删除用户签到记录
            Record.deleteByOwner({
              owner: id
            }, result => {
              if(result.done){
                res.json({code:0,msg:'删除成功'});
              }else{
                res.json({code:1,msg:result.data});
              }
            })
          }else{
            res.json({code:1,msg:result.data});
          }
        })
      } else {
        res.status(404).json({code:1,msg:result.data});
      }
    })
  }else{
    res.status(404).json({code:1,msg:'没有该用户'});
  }
}





// 修改用户信息
exports.modifyUser = (req, res) => {
  const studentId = req.body.studentId;
  const realname = req.body.realname;

  const id = req.params.id;
  
  // 校验 id
  if(id && !id.match(idReg)){
    res.status(404).json({code:1,msg:'没有该用户'});
    return;
  }

  if( !(studentId || realname) ){
    res.json({code:1,msg:'缺失参数'});
    return;
  }

  User.findById({
    id:id
  }, result => {
    if(result.done){
      const newInfo = {id:id};

      studentId ? (newInfo['studentId'] = studentId.trim() ) : null;
      realname ? (newInfo['realname'] = realname.trim() ) : null;

      User.updateInfo(newInfo, result => {
        if(result.done){
          res.json({code:0,msg:'修改成功'});
        }else{
          res.json({code:1,msg:result.data});
        }
      });

    }else{
      res.json({code:1,msg:result.data});
    }
  })


}





// 获取用户信息
exports.getUser = (req, res) => {
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

  User.findUser(info, result => {
    if(result.done){
      res.json({
        code:0,
        msg:'查找成功',
        number: result.data.length,
        users: result.data.map(handlerUser)
      });
    }else{
      res.json({code:1,msg:result.data});
    }
  });

}


/**
 * 过滤用户信息，将查找到的用户信息处理成接口需要的形式
 * userInfo 存放用户信息的json对象
 * 返回处理后的json对象
 */
function handlerUser(userInfo){
  return {
    id: userInfo._id,
    studentId: userInfo.studentId,
    realname: userInfo.realname
  }
}