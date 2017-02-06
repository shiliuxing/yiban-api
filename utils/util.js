const parser = require('cron-parser');

/**
 * 校验cron表达式
 * cron 要校验的字符串
 * 校验通过返回true 不通过返回false
 */
exports.checkCron = (cron) => {
  try{
    const interval = parser.parseExpression(cron);
    return true;
  }catch(e){
    return false;
  }
}

/**
 * 判断新活动与其他已有的活动有没有时间上的冲突
 * newActivity 新活动
 * activities 活动信息数组
 *
 * 有冲突时返回true 无冲突时返回false
 */
exports.hasConflict = test;
function test(newActivity, activities) {
  newActivity = parseActivity(newActivity);
  
  for(let i=0;i<activities.length;i++){
    activities[i] = parseActivity(activities[i]);

    if( compareDate(newActivity, activities[i]) && compareTime(newActivity, activities[i]) ){
      return true;
    }
  }

  return false;
}

/**
 * 判断两个活动日期上的冲突
 * a1,a2为两个活动
 *
 * 有冲突时返回 true
 * 无冲突时返回 false
 */
function compareDate(a1,a2){
  const year = new Date().getFullYear();
  if(a1.week && a2.week){
    // 按照周数比较日期
    return conflictArr(a1.week,a2.week);
  }else if(a1.week){
    // 按照日期比较
    const date = parseWeekToDate(year,a2.month,a1.week);
    return conflictArr(a2.date,date);
  }else if(a2.week){
    // 按照日期比较
    const date = parseWeekToDate(year,a1.month,a2.week);
    return conflictArr(a1.date,date);
  }else{
    // 按照日期比较
    return conflictArr(a1.date,a2.date);
  }

}

/**
 * 判断两个活动时间上的冲突
 * a1,a2为两个活动
 * type为 比较的类型，有 时分秒 3种类型
 * reversed 记录是否已经将a1,a2反转过的标志变量
 *
 * 每个活动包含start,end属性
 * a.start 活动的开始时间
 * a.end 活动的结束时间
 *
 * 有冲突返回 true
 * 无冲突返回 false
 */
function compareTime(a1,a2,type='hour',reversed=false){
  console.log('测试类型:',type,' 反转:',reversed);

  if( a1.end[type] < a2.start[type] ){
    return false;
  }else if( a1.end[type] === a2.start[type] ){
    if(type === 'hour'){
      return compareTime(a1,a2,'minute',reversed);
    }else if(type === 'minute'){
      return compareTime(a1,a2,'second',reversed);
    }else{
      return false;
    }
  }else{
    if(reversed){
      return true;
    }else if(type === 'hour'){
      return compareTime(a2,a1,'hour',true);
    }else if(type === 'minute'){
      return compareTime(a2,a1,'minute',true);
    }else if(type === 'second') {
      return compareTime(a2,a1,'second',true);
    }
  }

}

/**
 * 解析活动
 */
function parseActivity(activity){
  const start = activity.start.split(' ');
  const end = activity.end.split(' ');

  return {
    week: parseDate(start[5]),
    month: parseInt(start[4]) ? parseInt(start[4]) : false,
    date: parseDate(start[3]),
    start: {
      hour: parseInt(start[2]),
      minute: parseInt(start[1]),
      second: parseInt(start[0])
    },
    end: {
      hour: parseInt(end[2]),
      minute: parseInt(end[1]),
      second: parseInt(end[0])
    }
  }
}

/**
 * 解析包含 , - 这两种符号的日期形式
 */
function parseDate(str) {
  let arr = [];
  if (str === '*') {
    arr = false;
  } else {
    str = str.split(',');
    for (let i = 0; i < str.length; i++) {
      if (Number(str[i])) {
        arr.push(Number(str[i]));
      } else {
        str[i] = str[i].split('-');
        for (let j = Number(str[i][0]); j <= str[i][1]; j++) {
          arr.push(j);
        }
      }
    }
  }

  return arr;
}

/**
 * 将星期数组转换成日期数组
 * year 年份
 * month 月份
 * arr 数字数组代表星期一至星期日
 * 返回数字数组代表输入的年月的日期
 */
function parseWeekToDate(year,month,arr){
  const date = [];
  const len = new Date(year,month-1,0).getDate();
  const firstDay = new Date(year,month-1,1).getDay();
  for(let i=0;i<arr.length;i++){
    if(arr[i] === 7) arr[i] = 0;
    let subDate = 1 - firstDay + arr[i];
    while(subDate<=len){
      date.push(subDate);
      subDate += 7;
    }
  }
  return date.sort( (a,b) => {return a-b} );
}

/**
 * 判断两个数组中有没有相同的元素
 * w1,w2 数组
 * 有 返回 true
 * 无 返回 false
 */
function conflictArr(w1,w2){
  for(let i=0;i<w1.length;i++) {
    for(let j=0;j<w2.length;j++) {
      if(w1[i] === w2[j]){
        return true;
      }
    }
  }
  return false;
}

// 测试

// 每周一至周三 19:00-21:00
// start: 0 0 19 * * 1-3
// end: 0 0 21 * * 1-3

// 每周二和每周五 16:00-17:00
// start: 0 0 16 * * 2,5
// end: 0 0 17 * * 2,5

// 24日至26日 19:00-21:00
// start: 0 0 19 24-26 1 *
// end: 0 0 21 24-26 1 *

// 24日和26日 16:00-17:00
// start: 0 0 16 24,26 1 *
// end: 0 0 17 24,26 1 *

/*
try {
  const interval = parser.parseExpression('0 0 16 * * 7,4-6,1');

  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toString());
  console.log('Date: ', interval.next().toString());
} catch (err) {
  console.log('Error: ' + err.message);
}

*/


// test({
//   start: '0 0 19 * * 1-3,7',
//   end: '0 0 21 * * 1-3,7'
// },[{
//   start: '1 0 21 26-28 1 *',
//   end: '0 0 22 26-28 1 *'
// }])

// test({
//   start: '0 0 15 25-28 1 *',
//   end: '0 0 16 25-28 1 *'
// },[{
//   start: '0 1 16 * * 1-3,7',
//   end: '0 0 17 * * 1-3,7'
// }])