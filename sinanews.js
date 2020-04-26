var crawler = require('./crawler.js');

var format = {
    source_name : "新浪新闻",
    myEncoding : "utf-8",
    seedURL : 'http://news.sina.com.cn/',
    seedURL_format : "$('div>ul>li>a')",
    keywords_format : " $('div[class=\"keywords\"]>a').text()",
    title_format : "$('h1[class=\"main-title\"]').text()",
    date_format : "$('span[class=\"date\"]').text()",
    author_format : "$('a[class=\"source\"]').text()",
    content_format : "$('div[class=\"article\"]').text()",
    desc_format : " $('meta[property=\"og:description\"]').eq(0).attr(\"content\")",
    source_format : "$('a[class=\"source\"]').text()",
    url_reg : /\/\/news.sina.com.cn\/[a-z]\/.*\.shtml/,
    regExp : /((\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2})|(\d{4}年\d{1,2}月\d{1,2}日)/
};

crawler.seedget(format);