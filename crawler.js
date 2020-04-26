var fs = require('fs');
var myRequest = require('request');
var myCheerio = require('cheerio');
var myIconv = require('iconv-lite');
require('date-utils');
var mysql = require('./mysql.js');



//防止网站屏蔽我们的爬虫
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
}

//request模块异步fetch url
function request(url, callback) {
    var options = {
        url: url,
        encoding: null,
        //proxy: 'http://x.x.x.x:8080',
        headers: headers,
        timeout: 1000 //
    }
    myRequest(options, callback)
};

function seedget(format) {
    // console.log(format.seedURL);
    request(format.seedURL, function(err, res, body) { //读取种子页面
        try {
            //用iconv转换编码
            var html = myIconv.decode(body, format.myEncoding);
            // console.log(html);
            //准备用cheerio解析html
            var $ = myCheerio.load(html, { decodeEntities: true });
        } catch (e) { console.log('读种子页面并转码出错：' + e) };

        var seedurl_news;
        try {
            seedurl_news = eval(format.seedURL_format);
        } catch (e) { console.log('url列表所处的html块识别出错：' + e) };

        seedurl_news.each(function(i, e) { //遍历种子页面里所有的a链接
            var myURL = "";
            try {
                //得到具体新闻url
                var href = "";
                href = $(e).attr("href");
                if (href == undefined) return;
                if (!format.url_reg.test(href)) return;
                myURL = "http:"+format.url_reg.exec(href)[0];
            } catch (e) { console.log('识别种子页面中的新闻链接出错：' + e) }

            var fetch_url_Sql = 'select url from fetches where url=?';
            var fetch_url_Sql_Params = [myURL];
            mysql.query(fetch_url_Sql, fetch_url_Sql_Params, function(qerr, vals, fields) {
                if (vals.length > 0) {
                    console.log('URL duplicate!')
                    // return;
                } else {
                    console.log('读取新闻');
                    newsGet(myURL,format); //读取新闻页面
                }
            });
        });
    });
};

function newsGet(myURL, format) { //读取新闻页面
    request(myURL, function(err, res, body) { //读取新闻页面
        try {
            var html_news = myIconv.decode(body, format.myEncoding); //用iconv转换编码
            // console.log(html_news);
            //准备用cheerio解析html_news
            var $ = myCheerio.load(html_news, { decodeEntities: true });
            myhtml = html_news;
            // console.log("!!!!!!!!");
            // console.log(myURL);
        } catch (e) {    console.log('读新闻页面并转码出错：' + e);};

        console.log("转码读取成功:" + myURL);
        //动态执行format字符串，构建json对象准备写入文件或数据库
        var fetch = {};
        fetch.title = "";
        fetch.content = "";
        fetch.publish_date = (new Date()).toFormat("YYYY-MM-DD");
        //fetch.html = myhtml;
        fetch.url = myURL;
        fetch.source_name = format.source_name;
        fetch.source_encoding = format.myEncoding; //编码
        fetch.crawltime = new Date();

        if (fetch.keywords_format == "") fetch.keywords = format.source_name; // eval(keywords_format);  //没有关键词就用sourcename
        else fetch.keywords = eval(format.keywords_format);

        if (format.title_format == "") fetch.title = ""
        else fetch.title = eval(format.title_format); //标题

        if (format.author_format == "") fetch.author = format.source_name; //eval(author_format);  //作者
        else fetch.author = eval(format.author_format);
        console.log('author: ' + fetch.author);

        if (format.date_format != "") fetch.publish_date = eval(format.date_format); //刊登日期   
        console.log('date: ' + fetch.publish_date);

        if (fetch.publish_date == undefined);
        else {
            fetch.publish_date = format.regExp.exec(fetch.publish_date)[0];
            fetch.publish_date = fetch.publish_date.replace('年', '-')
            fetch.publish_date = fetch.publish_date.replace('月', '-')
            fetch.publish_date = fetch.publish_date.replace('日', '')
            fetch.publish_date = new Date(fetch.publish_date).toFormat("YYYY-MM-DD");
        }

        if (format.content_format == "") fetch.content = "";
        else fetch.content = eval(format.content_format).replace("\r\n" + fetch.author, ""); //内容,是否要去掉作者信息自行决定

        if (format.source_format == "") fetch.source = fetch.source_name;
        else fetch.source = eval(format.source_format).replace("\r\n", ""); //来源

        if (format.desc_format == "") fetch.desc = fetch.title;
        else  {
            fetch.desc = eval(format.desc_format); //摘要
            if (fetch.desc == undefined) fetch.desc = "";
            else fetch.desc.replace("\r\n", "");
        }   

        // var filename = source_name + "_" + (new Date()).toFormat("YYYY-MM-DD") +
        //     "_" + myURL.substr(myURL.lastIndexOf('/') + 1) + ".json";
        // ////存储json
        // fs.writeFileSync(filename, JSON.stringify(fetch));

        var fetchAddSql = 'INSERT INTO fetches(url,source_name,source_encoding,title,' +
            'keywords,author,publish_date,crawltime,content, description) VALUES(?,?,?,?,?,?,?,?,?,?)';
        var fetchAddSql_Params = [fetch.url, fetch.source_name, fetch.source_encoding,
            fetch.title, fetch.keywords, fetch.author, fetch.publish_date,
            fetch.crawltime.toFormat("YYYY-MM-DD HH24:MI:SS"), fetch.content, fetch.desc
        ];

        //执行sql，数据库中fetch表里的url属性是unique的，不会把重复的url内容写入数据库
        mysql.query(fetchAddSql, fetchAddSql_Params, function(qerr, vals, fields) {
            if (qerr) {
                console.log(qerr);
            }
        }); //mysql写入
    });
}

exports.seedget = seedget;