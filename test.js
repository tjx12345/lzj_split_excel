const xls = require('./xlsxTools.js');
const root = './files_' + Date.now();
const path = require('path');
const v8 = require('v8');
v8.setFlagsFromString('--max_old_space_size=4096');

console.setDebugMode = function (isDebug) {
    if (!isDebug) {
       global.log = console.log;
       console.log = function() {} 
    } else {
        console.log = global.log||console.log;
    }
}

console.setDebugMode(true);
const importStu = {
    titles: ['学年', '主考老师', '监考老师', '学期', '考试类型', '试卷', '学院', '学生姓名', '班级', '题目', '选项', '正确答案', '学生答案', '成绩','考试id'],
    fields: [
        'schoolyear',
        'master',
        'monitor',
        'semester',
        'type',
        'papers_name',
        'academe_name',
        'student_name',
        'class_name',
        'html',
        'selects',
        'answer',
        'reply',
        'score',  'exam_id',

    ]
}
let stumap = new Map()
xls.setMiddleWare(function(data) {
   
    let { student_name, papers_name, class_name } = data[0];
     console.log('准备生成文件',papers_name,class_name,student_name);
    let stuCount = stumap.get(student_name);
    // 同名叠加
    if (stuCount) stumap.set(student_name, stuCount + 1);
    else stumap.set(student_name, 1);
    
    let filename = path.join(root, papers_name, class_name, student_name + '_' + stumap.get(student_name) + '.xls');

    // 生成excel buffer 工具函数
    xls.generatorExcel(filename,importStu.titles,data);
});
console.time('计时');
const arr = xls.parseXlsx('./全部.xls', importStu);
console.timeEnd('计时');