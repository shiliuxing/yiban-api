const User = require('../models/user');

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

    User.findById


    User.deleteById({
      id: id
    }, result => {
      if(result.done){
        
      }else{
        res.json({code:1,msg:result.data});
      }
    })
  }else{
    res.status(404).json({code:1,msg:'没有该用户'});
  }
}





// 修改用户信息
exports.modifyUser = (req, res) => {

}





// 获取用户信息
exports.getUser = (req, res) => {

}
