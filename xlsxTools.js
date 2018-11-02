/*
 * 操作xlsx
 * @Author: Tujunxiong 
 * @Date: 2018-09-27 17:30:31 
 * @Last Modified by:   Tujunxiong
 * @Last Modified time: 2018-09-27 17:27:31
 */


const fs = require('fs'),
    fsPlus = require('fs-extra'),
    xlsx = require('node-xlsx').default;
const arrayTools = require('./arrayTools');
let dataObjs = [];

exports.generatorExcel = function(filePath, title, data, sheet = 'mySheetName') {
    let arr = arrayTools.spreadObjectToArray(data);
    arr.unshift(title);
    var buffer = xlsx.build([{ name: sheet, data: arr }]);
    fsPlus.outputFile(filePath, buffer).catch(console.log)
}

exports.setMiddleWare = function(callback) {
    this.callback = callback;
}
/**
 * [parseXlsx 根据字段解析xlsx]
 * @param  {[type]}    filePath   [description]
 * @param  {...[type]} needFields [description]
 * @return {[type]}               [description]
 * @author tjx
 */
exports.parseXlsx = function(filePath, template) {
    function isLast(start,end) {
        return start === end;
    }
    let fileDataArr = [];
    let titles = template.titles;
    let needFields = template.fields;
    let prevIndex = 0;
    try {
        var workSheetsFromBuffers = xlsx.parse(fs.readFileSync(filePath));
        // 遍历多个sheet
        fileDataArr = workSheetsFromBuffers.map(sheet => {

            let data = sheet.data;

            let row = data.shift();
            // 判断传递参数数量问题
            if (needFields.length != titles.length) {
                throw new Error('标题及属性名字段数量不一致！');
            }
            // 获取过多字段
            if (row.length < needFields.length) {
                throw new Error('获取的needFields数量大于excel的字段数！');
            }
            // 传递过多中文字段
            if (row.length < titles.length) {
                throw new Error('获取的titles数量大于excel的字段数！');
            }

            for (let i = 0, len = data.length; i < len; i++) {

                let info = data[i];
                let rowInfo = {};
                for (let j = 0, len = titles.length; j < len; j++) {
                    rowInfo[needFields[j]] = info[j];
                }
                dataObjs.push(rowInfo);
                // 如果只有一条或者第一条的时候
                if (i === 0) {
                    isLast(i, len - 1) && this.callback && this.callback(dataObjs.slice(0, 1));
                    continue;
                }
                let prevStu = dataObjs[i - 1] || {};

                if (rowInfo.student_name != prevStu.student_name || rowInfo.class_name != prevStu.class_name || rowInfo.exam_id !== prevStu.exam_id || i === data.length - 1) {
                    this.callback && this.callback(dataObjs.slice(prevIndex, isLast(i, len - 1) ? i + 1 : i));
                    prevIndex = i;
                }
                // middleware end
            }
            return dataObjs;

        });
        // 解剖数组，并合并
        return arrayTools.spreadArray(fileDataArr);
    } catch (e) {
        throw e;
    }
}