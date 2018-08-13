// 清除 cookie用
var tstampZeroDate = new Date(0);

/**
 * 獲取 query string的值
 * @param name 名稱, url 指定的網址
 * @returns query string的值
 */
getQueryStringByName = function(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// setQueryStringByName = function(name, value) {
//     var url = window.location.search;
//     var regex = new RegExp("([?&])" + name + "=.*?(&|$)", "i");
//     var separator = url.indexOf('?') !== -1 ? "&" : "?";
//     if (url.match(regex)) {
//         return url.replace(regex, '$1' + name + "=" + value + '$2');
//     } else {
//         return url + separator + name + "=" + value;
//     }
// };

/**
 * 處理 Authorization的資料
 * @param
 * @returns authorization_header
 */
getAuthHeader = function() {
    var dt = new Date();
    var tstamp = Math.round(dt.getTime() / 1000);
    var authorization_header = "Bearer version=3&tstamp=" + tstamp + "&access_token=" + getCookieValue('cookie_access_token');
    // console.log("Authorization = " + authorization_header);
    return authorization_header;
};

/**
 * 共通使用的跳出訊息
 * @param langKey 語言 key(要顯示的訊息)
 * @returns null
 */
showModalHelpMsg = function(langKey) {
    var text = makeLang(langKey);
    $('#help_message').attr('data-lang-tx', langKey).html(text);
    $('#modal_help_message').modal('show');
};

/**
 * 添加 cookie
 * @param name cookie名稱, value 賦予的值, days 此cookie可存在的天數, path 路徑
 * @returns null
 */
addCookie = function(name, value, days, path) {
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 3600000 * 24);
    //path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用
    path = path == "" ? "" : ";path=" + path;
    //GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC
    //参数days只能是数字型
    var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
};

/**
 * 刪除 cookie(設置 cookie無效)
 * @param name cookie名稱, path 路徑
 * @returns null
 */
deleteCookie = function(name, path) {
    var name = escape(name);
    var expires = tstampZeroDate;
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
};

/**
 * 刪除所有 cookie(設置 cookie無效)
 * @param
 * @returns null
 */
deleteAllCookie = function() {
    var expires = tstampZeroDate;
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c + ";expires=" + expires.toUTCString();
    });
};

/**
 * 獲取 cookie值
 * @param name cookie名稱
 * @returns 指定的 cookie值
 */
getCookieValue = function(name) {
    //用处理字符串的方式查找到key对应value
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1) { //如果pos值为-1则说明搜索"version="失败
        var start = pos + name.length; //cookie值开始的位置
        var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
        if (end == -1) end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie
        var value = allcookies.substring(start, end); //提取cookie的值
        return (value); //对它解码
    } else { //搜索失败，返回空字符串
        return undefined;
    }
};

/**
 * 跳過 Callback執行
 * @param
 * @returns null
 */
notCallback = function() {};


/**
 * 進行 ajax
 * @param url 路徑, data 指定對象, type 'GET' or 'POST'等類型, callback callback執行事件, asyncBoolean 是否為非同步處理
 * @returns null
 */
doAjax = function(option, callback) {
    var status, type, cache, asyncBoolean, headers;
    if (typeof(option.url) === 'undefined') {
        console.log('Ajax URL is undefined');
        return;
    }
    if (typeof(option.type) === 'undefined') {
        type = 'GET';
    } else {
        type = option.type;
    }
    if (typeof(option.async) !== 'boolean') {
        asyncBoolean = true;
    } else {
        asyncBoolean = option.async;
    }
    if (typeof(option.cache) !== 'boolean') {
        cache = false;
    } else {
        cache = option.cache;
    }
    if (typeof(option.headers) === 'undefined') {
        headers = '';
    } else {
        headers = option.headers;
    }
    $.ajax({
        url: option.url,
        type: type,
        cache: cache,
        async: asyncBoolean,
        data: option.data,
        headers: headers,
        error: function(data) {
            status = 'error';
            console.warn(option.url);
            console.log("%c" + 'error', 'color: #9c3d3d;');
            console.log(JSON.stringify(data));
            if (typeof(callback) !== 'undefined') {
                callback(data, status);
            }
        },
        success: function(data) {
            status = 'success';
            if (typeof(data) == 'string') {
                data = JSON.parse(data);
            }
            console.warn(option.url);
            console.log("%c" + 'success', 'color: #3d9c60;');
            console.log(data);
            if (typeof(callback) !== 'undefined') {
                callback(data, status);
            }
        }
    });
};

/**
 * 時間戳轉換日期時間格式, EX: 2017-06-12 18:02:00
 * @param name cookie名稱
 * @returns 日期時間
 */
timeStampToDate = function(timeStamp) {
    if (timeStamp == undefined) {
        return '<i class="fa fa-minus" aria-hidden="true"></i>';
    } else {
        var date = new Date(Number(timeStamp) * 1000);
        var text =
            date.getFullYear() + "-" +
            ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("00" + date.getDate()).slice(-2) + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2)
        return text;
    }
};

/**
 * 將日期時間轉換為時間差, EX: 18:02:00
 * @param timeStamp 時間戳, showText 顯示單位
 * @returns text 時間差(hh:mm:ss)
 */
timeStampToTime = function(timeStamp, showText) {
    var text;
    if (timeStamp == undefined) {
        text = '<i class="fa fa-minus" aria-hidden="true"></i>';
    } else {
        timeStamp = Number(timeStamp) * 1000;
        var date = new Date(timeStamp);
        if (timeStamp >= 3600000) {
            // 小時: 分鐘: 秒 (一小時以上)
            if (showText) {
                text = '<sapn>' + Math.floor(timeStamp / 3600000) + 'h ' + ("00" + date.getUTCMinutes()).slice(-2) + 'm ' + ("00" + date.getUTCSeconds()).slice(-2) + 's</span>';
            } else {
                text = '<sapn>' + Math.floor(timeStamp / 3600000) + ':' + ("00" + date.getUTCMinutes()).slice(-2) + ':' + ("00" + date.getUTCSeconds()).slice(-2) + '</span>';
            }
        } else if (timeStamp >= 60000) {
            // 分鐘: 秒 (不滿一小時)
            if (showText) {
                text = '<sapn>0:' + ("00" + date.getUTCMinutes()).slice(-2) + 'm ' + ("00" + date.getUTCSeconds()).slice(-2) + 's</span>';
            } else {
                text = '<sapn>0:' + ("00" + date.getUTCMinutes()).slice(-2) + ':' + ("00" + date.getUTCSeconds()).slice(-2) + '</span>';
            }
        } else {
            // 秒 (不滿一分鐘)
            if (showText) {
                text = '<sapn>0:00:' + ("00" + date.getUTCSeconds()).slice(-2) + 's</span>';
            } else {
                text = '<sapn>0:00:' + ("00" + date.getUTCSeconds()).slice(-2) + '</span>';
            }
        }
    }
    return text;
};

/**
 * 設定 A時間 - B時間的時間長
 * @param aTime A時間(較大，如果為字串"now"自動轉換為現在時間), bTime B時間(較小), boolean 是否顯示時間單位(EX: 24h 60m 60s)
 * @returns text 時間差(hh:mm:ss) or "-"圖示
 */
setDurationTime = function(aTime, bTime, boolean) {
    var text;
    if (typeof(boolean) != 'boolean') {
        boolean = false;
    }
    if (aTime == undefined || bTime == undefined) {
        text = '<i class="fa fa-minus" aria-hidden="true"></i>';
    } else {
        if (aTime == 'now') {
            aTime = Math.floor(new Date().getTime() / 1000);
        }
        text = timeStampToTime((Number(aTime) - Number(bTime)), boolean);
    }
    return text;
};

/**
 * 產生隨機數字
 * @param maxNum 最大值, minNum 最小值
 * @returns 隨機數字
 */
randomNumber = function(maxNum, minNum) {
    var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    return n
};

/**
 * 清除所有循環事件
 * @param
 * @returns null
 */
clearAllSetInterval = function() {
    for (var i = 0; i < clearIntervalArray.length; i++) {
        clearInterval(clearIntervalArray[i]);
    }
    clearIntervalArray = [];
};

/**
 * 將 img.svg元素轉換成 svg格式
 * @param
 * @returns null
 */
imgToSVG = function() {
    $('img.svg').each(function() {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');
            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
            }
            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });
};
