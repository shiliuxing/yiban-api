# yiban-api
使用 Express + MongoDB 搭建的签到管理系统API服务

# API

| 接口名称 | 方式 | 地址 |
| ------ | ------ | ------ |
| [登录](#登录) | POST | /auth/login |
| [退出](#退出) | POST | /auth/logout |
| [新增活动](#新增活动) | POST | /activity |
| [删除活动](#删除活动) | DELETE | /activity/:id |
| [修改活动](#修改活动) | PUT | /activity/:id |
| [获取活动](#获取活动) | GET | /activity |
| [根据活动名获取活动信息](#根据活动名获取活动信息) | GET | /activity/:name |
| [新增机器](#新增机器) | POST | /machine |
| [删除机器](#删除机器) | DELETE | /machine/:id |
| [修改机器信息](#修改机器信息) | PUT | /machine/:id |
| [获取机器信息](#获取机器信息) | GET | /machine |
| [根据机器id获取机器信息](#根据机器id获取机器信息) | GET | /machine/:id |
| [新增签到记录](#新增签到记录) | POST | /record |
| [删除签到记录](#删除签到记录) | DELETE | /record/:id |
| [修改签到记录](#修改签到记录) | PUT | /record/:id |
| [获取最近签到记录](#获取最近签到记录) | GET | /record |
| [根据活动名查找记录](#根据活动名查找记录) | GET | /record/activity/:name |
| [根据用户真实姓名查找记录](#根据用户真实姓名查找记录) | GET | /record/user/name/:name |
| [根据用户id查找记录](#根据用户id查找记录) | GET | /record/user/id/:id |
| [新增用户](#新增用户) | POST | /user |
| [删除用户](#删除用户) | DELETE | /user/:id |
| [修改用户信息](#修改用户信息) | PUT | /user/:id |
| [获取用户信息](#获取用户信息) | GET | /user |
