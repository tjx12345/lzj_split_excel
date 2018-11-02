/**
 * 展开数组，合并成一个
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
exports.spreadArray = function (arr) { 
   let temp = [];
   arr.forEach(innerArr=> {
        if(innerArr instanceof Array ) {
            temp = temp.concat(exports.spreadArray(innerArr))
        }else {
            temp = temp.concat(innerArr)
        }
        
   })
  return temp;
}
// 数组内对象装欢数组
exports.spreadObjectToArray = function (obj) { 

   if (!(obj instanceof Array)) return Object.values(obj);
   return obj.map(inner => exports.spreadObjectToArray(inner))
}
