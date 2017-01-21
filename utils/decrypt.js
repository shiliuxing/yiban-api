const crypto = require('crypto');
const MCrypt = require('mcrypt').MCrypt;

const config = require('../config');

/**
 * 解密rijndael-128 cbc算法
 * data 要解密的字符串
 * 返回解密后的字符串
 */
exports.rijndael128 = (data) => {
  const mcrypt = new MCrypt('rijndael-128', 'cbc');
  mcrypt.open(config.appsecret,config.appid);
  try{
    let plaintext = mcrypt.decrypt(new Buffer(data, 'hex'));
    plaintext = plaintext.toString();
    
    // 清除trim()清不掉的字符
    const emptyChar = String.fromCharCode(0);
    const reg = new RegExp(emptyChar,'g');
    plaintext = plaintext.replace(reg,'');
    
    return plaintext.trim();
  }catch(e){
    console.log('授权信息解密失败:',data);
    return '';
  }

}

/**
 * 解密 aes192 算法
 * data 要解密的字符串
 * 返回解密后的字符串
 */
exports.enAes192 = (data) => {
  try{
    const decipher = crypto.createDecipher('aes192', config.secret);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }catch(e){
    console.log('解密失败：',data);
    return '';
  }
}

/**
 * 加密 aes192 算法
 * data 要加密的字符串
 * 返回加密后的字符串
 */
exports.deAes192 = data => {
  try{
    const cipher = crypto.createCipher('aes192', config.secret);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }catch(e){
    console.log('加密失败：',data);
    return '';
  }
}

/**
 * md5 加密
 * data 要加密的字符串
 * 返回要加密的字符串
 */
exports.md5 = (data) => {
  return crypto.createHash('md5').update(data).digest('hex');  
}
