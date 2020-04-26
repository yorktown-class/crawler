var crawler = require('./crawler.js');

var format = {
    source_name : "搜狐新闻",
    myEncoding : "utf-8",
    seedURL : 'http://news.sohu.com/',
    seedURL_format : "$('a')",
    keywords_format : " $('meta[name=\"keywords\"]').eq(0).attr(\"content\")",
    title_format : "$('title').text()",
    date_format : "$('meta[itemprop=\"datePublished\"]').eq(0).attr(\"content\")",
    author_format : "$('div>div>div>div>h4>a').text()",
    content_format : "$('div[data-spm=\"content\"]').text()",
    desc_format : " $('meta[name=\"description\"]').eq(0).attr(\"content\")",
    source_format : "$('#source_baidu').text()",
    url_reg : /\/\/www\.sohu\.com\/a\/.*/,
    regExp : /((\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2})|(\d{4}年\d{1,2}月\d{1,2}日)/
};

crawler.seedget(format);