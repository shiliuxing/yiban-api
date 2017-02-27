module.exports = {
  port: process.env.PORT || 4569,
  mongodb: 'mongodb://yiban:yiban@127.0.0.1/yiban',
  secret: 'flyingstudio',
  expires: 60*60, // token有效时间，单位为秒
  webUrl: 'http://localhost:8080'
};
