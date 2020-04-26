var crawler = require('./crawler');

var format = {
    source_name : "中国新闻网",
    myEncoding : "utf-8",
    seedURL : 'http://www.chinanews.com/',
    seedURL_format : "$('a')",
    keywords_format : " $('meta[name=\"keywords\"]').eq(0).attr(\"content\")",
    title_format : "$('title').text()",
    date_format : "$('#pubtime_baidu').text()",
    author_format : "$('#editor_baidu').text()",
    content_format : "$('.left_zw').text()",
    desc_format : " $('meta[name=\"description\"]').eq(0).attr(\"content\")",
    source_format : "$('#source_baidu').text()",
    url_reg : /^\/\/www\.chinanews\.com\/.*\/(\d{4})\/(\d{2})-(\d{2})\/(\d{7}).shtml$/,
    regExp : /((\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2})|(\d{4}年\d{1,2}月\d{1,2}日)/
};

crawler.seedget(format);