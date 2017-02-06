const Machine = require('../models/machine');
const Activity = require('../models/activity');
// TODO: 删除机器时要删除机器绑定的活动

const decrypt = require('../utils/decrypt');

const macReg = /^[0-9a-fA-F]{2}(:[0-9a-fA-F]{2}){5}$/;
const idReg = /^[0-9a-fA-F]{24}$/;



// 新增机器
exports.addMachine = (req, res) => {
  const mac = req.body.mac;
  const cpu = req.body.cpu;
  const mark = req.body.mark;

  // 校验 MAC 地址
  if(mac && !mac.match(macReg)){
    res.json({code:1,msg:'mac地址格式不正确'});
    return;
  }

  // 参数齐全
  if(mac && cpu && mark){
    // 将mac地址与cpu型号加密成机器码
    const code = decrypt.deAes192(mac.trim().toLowerCase() + '---' + cpu.trim().toLowerCase());

    if(code){
      Machine.save({
        code: code,
        mark: mark.trim()
      }, (result) => {
        if(result.done){
          res.json({code:0,msg:'新增成功',id:result.data._id});
        }else{
          res.json({code:1,msg:result.data});
        }
      });
    }else{
      res.json({code:1,msg:'机器信息加密失败'});
    }

  // 参数缺失
  }else{
    res.json({code:1,msg:'缺失参数'});
  }
}



// 删除机器
exports.deleteMachine = (req, res) => {
  const id = req.params.id;

  if(id && id.match(idReg)){

    Machine.findById({
      id:id
    }, result => {
      if(result.done){

        Machine.deleteById({
          id:id
        }, result => {
          if(result.done){
            res.json({code:0,msg:'删除成功'});
          }else{
            res.json({code:1,msg:result.data});
          }
        });

      }else{
        res.status(404).json({code:1,msg:result.data});
      }
    });


  }else{
    res.status(404).json({code:1,msg:'没有该机器'});
  }
}



// 修改机器信息
exports.modifyMachine = (req, res) => {
  const mac = req.body.mac;
  const cpu = req.body.cpu;
  const mark = req.body.mark;

  const id = req.params.id;

  // 校验 id
  if(id && !id.match(idReg)){
    res.status(404).json({code:1,msg:'没有该机器'});
    return;
  }

  // 校验 MAC 地址
  if(mac && !mac.match(macReg)){
    res.json({code:1,msg:'mac地址格式不正确'});
    return;
  }

  if( !(mac || cpu || mark) ){
    res.json({code:1,msg:'缺失参数'});
    return;
  }

  Machine.findById({
    id:id
  }, result => {
    if(result.done){
      const newInfo = {id:id};
      const code = decrypt.enAes192(result.data.code).split('---');

      if(mac && cpu){
        newInfo['code'] = mac.trim().toLowerCase() + '---' + cpu.trim().toLowerCase();
      }else if(mac){
        newInfo['code'] = mac.trim().toLowerCase() + '---' + code[1];
      }else if(cpu){
        newInfo['code'] = code[0] + '---' + cpu.trim().toLowerCase();
      }

      newInfo['code'] ? (newInfo['code'] = decrypt.deAes192(newInfo['code'])) : null;
      mark ? (newInfo['mark'] = mark.trim()) : null;

      Machine.updateInfo(newInfo, result => {
        if(result.done){
          res.json({code:0,msg:'修改成功'});
        }else{
          res.json({code:1,msg:result.data});
        }
      });

    }else{
      res.status(404).json({code:1,msg:result.data});
    }
  })

}



// 获得所有机器
exports.getAllMachine = (req, res) => {
  Machine.findAll(result => {
    if(result.done){
      res.json({
        code:0,
        msg:'查找成功',
        number: result.data.length,
        data: result.data.map(handlerMachine)
      });
    }else{
      res.json({code:1,msg:result.data});
    }
  });

}





// 通过id获取机器
exports.getMachineById = (req, res) => {
  const id = req.params.id;

  if(id && id.match(idReg)){
    Machine.findById({id:id},result => {
      if(result.done){
        const code = decrypt.enAes192(result.data.code).split('---');
        res.json({
          code:0,
          msg:'查找成功',
          mark: result.data.mark,
          mac: code[0],
          cpu: code[1]
        });
      }else{
        res.json({code:1,msg:result.data});
      }
    })
  }else{
    res.status(404).json({code:1,msg:'没有该机器'});
  }
}





/**
 * 过滤机器信息，将查找到的机器信息处理成接口需要的形式
 * machineInfo 存放机器信息的json对象
 * 返回处理后json对象
 */
function handlerMachine(machineInfo){
  return {
    id: machineInfo._id,
    mark: machineInfo.mark
  }
}
