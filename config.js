module.exports = {
  port: process.env.PORT || 4569,
  mongodb: 'mongodb://yiban:yiban@127.0.0.1/yiban',
  secret: 'flyingstudio',
  cookieTime: 60*60*1000, // cookie有效时间
};