var page   = require('webpage').create();
var system = require('system');

// 如果没有给定要搜索的关键词, 就提示后退出程序  
if(system.args.length === 1){
    console.log('Usage: task.js <some KEYWORD>');
    phantom.exit();
}

var start   = Date.now();
var keyword = system.args[1];

page.open('http://www.baidu.com/s?wd=' + keyword, function(status){

    var result   = {
        code     : undefined,
        msg      : undefined,
        word     : keyword,
        time     : undefined,
        datalist : []
    };

    // 判断是否抓取失败
    if(status !== "success"){

        result.code = 0;
        result.msg  = '抓取失败';
        result.time = Date.now() - start;

        console.log(JSON.stringify(result, null, 4));
        phantom.exit();
    }

    result.datalist = JSON.parse(page.evaluate(function(){
        var resultArr = [];
        var resultList = document.querySelectorAll(".c-container");
        var resultListArr = [].slice.call(resultList);
        
        resultListArr.forEach(function(item){
            var tempObj = {
                title : item.querySelector('h3 a').innerText,
                info  : item.querySelector('.c-span-last') ? item.querySelector('.c-span-last').innerText : null,
                link  : item.querySelector('h3 a').href,
                pic   : item.querySelector('.c-img') ? item.querySelector('.c-img').src : null
            }
            resultArr.push(tempObj);
        })

        return JSON.stringify(resultArr)
    })) 

    result.code = 1;
    result.msg  = '抓取成功';
    result.time = Date.now() - start;

    console.log(JSON.stringify(result, null, 4));
    phantom.exit();
})