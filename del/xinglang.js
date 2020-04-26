request = require('request');
cheerio = require('cheerio');
fs = require('fs');


var url = "http://news.sina.com.cn";


function req(url, callback) {//request module fetching url
    var options = {
        url: url,  encoding: null, headers: null
    }
    request(options, callback);
}


function getHotNewsUrl(callback) {
    console.log("getHotNewsUrl");
    req(url, function(err, res, body){
        var $ = cheerio.load(body);
        console.log($.text);
        $('div#ad_entry_b2 ul li a').each(function(idx, ele) {
            let item = {
                title: $(ele).text(),
                href: $(ele).attr('href')
            };
            callback(item);
        })
    })
};

function saveNews(item, callback) {
    console.log(item.href);
    req(item.href, function(err, res, body){
        var $ = cheerio.load(body);
        var path = "xinglangnews/" + item.title;
        var content = "title: " + item.title;
        content = content + "\ndate: " + $('span[class="date"]').text();
        content = content + "\nauthor: " + $('meta[property="article:author"]').eq(0).attr("content");
        content = content + "\nencode: " + $('meta[http-equiv="Content-type"]').eq(0).attr("content");
        content = content + "\n\ncontent:" + $('div[class="article"]').text();
        fs.writeFile(path, content);

        // fs.writeFile(path, $.html());
    })
}

getHotNewsUrl(saveNews);