request = require('request');
cheerio = require('cheerio');
step = require('step');
fs = require('fs');


var url = "http://news.baidu.com/";


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
        $('div#pane-news ul li a').each(function(idx, ele) {
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
        var path = "news/" + item.title;
        fs.writeFile(path, $.text());
    })
}

getHotNewsUrl(saveNews);