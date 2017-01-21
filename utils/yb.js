const superagent = require('superagent');

/**
 * 获取实名认证信息
 * token 授权凭证
 */
exports.verify_me = (token, callback) => {
  const url = 'https://openapi.yiban.cn/user/verify_me?access_token='+token;
  superagent
    .get(url)
    .end((err, res) => {
      if(err || !res.ok){
        callback({err:err});
      }else{
        callback(JSON.parse(res.text));
      }
    });
}