$(document).ready(function() {
    // 設定分頁
    pageArray = [];
    $('#sidebar_menu .title-tab-item').each(function() {
        var page = $(this).find('.custom-link').attr('href').split('#')[1];
        pageArray.push(page);
    });
    hashCheck = true;
    // 初始，偵測 hash並 load對應頁面
    window.onhashchange = loadHashPage();
    // 持續監聽，偵測當hash改變並load對應頁面
    window.addEventListener("hashchange", loadHashPage, false);
    // 設置DataTable的文案
    setDataTableLang(getCookieValue('lang'));
    scrollLoadPage = false;
    scrollLoadPageFunction();

    // 定義 dataTable default設定
    dataTableOption = {
        // 語言
        "language": dataTableLang,
        // 是否顯示 search bar
        "searching": false,
        // 是否顯示頁面筆數選單
        "lengthChange": false,
        // 是否顯示換頁按鈕
        "paging": false,
        // 是否在底部顯示表格資訊
        "bInfo": false
    };

    // 將版號增加至首頁(sidebar下方)
    $('#version_text').html('v ' + CF_MAJOR_VERSION + '.' + CF_MINOR_VERSION + '.' + CF_BULID_VERSION + ' ' + CF_COMMIT_ID);

    // 按下網頁標題
    $('#web_title').on('click', function() {
        checkHashHref($(this));
    });

    // 按下左上選單按鈕
    $('#sidebar_menu_btn').on('click', function() {
        $(this).toggleClass('active');
        $('#sidebar_menu').toggleClass('active');
    });

    // 按下側邊欄的處理
    $('#sidebar_menu').on('click', '.title-tab-item', function() {
        checkHashHref($(this).find('a'));
        // 如果側邊欄為"active"狀態，移除側邊欄及側邊欄按鈕的"active"class
        if ($('#sidebar_menu').hasClass('active')) {
            $('#sidebar_menu_btn').removeClass('active');
            $('#sidebar_menu').removeClass('active');
        }
    });

    $('body').on('click', '.img-modal', function() {
        var src = $(this).attr('src');
        $('#modal_img_show').attr('href', src);
        $('#modal_img_show img').attr('src', src);
        $('#modal_img').modal('show');
    });
});
clearIntervalArray = [];

// 測試用模式，如果 CF_TEST_LANG不為空
if (CF_TEST_LANG != '') {
    addCookie('lang', CF_TEST_LANG);
}

/**
 * 判斷 hash並 load對應頁面
 * @param
 * @returns null
 */
loadHashPage = function() {
    if (hashCheck) {
        // 如果有循環事件存在，清除所有循環事件
        if (clearIntervalArray.length > 0) {
            clearAllSetInterval();
        }
        var page = window.location.hash.split('#')[1];
        console.log('hash = ' + page);
        if (page == undefined) {
            hashCheck = false;
            window.location.hash = pageArray[0];
            hashCheck = true;
        } else if (pageArray.indexOf(page) != -1) {
            $('.main-page').empty().load('page/' + page + '.html');
            $('a[href="#' + page + '"]').parent('.title-tab-item').addClass('active').siblings().removeClass('active');
        } else {
            // 如果hash不存在或不符，跳轉至錯誤頁面
            $('.main-page').empty().load('page/wrong_page.html');
        }
    }
};

/**
 * 如果 URL和 hash為同一頁，重新 load頁面
 * @param
 * @returns null
 */
checkHashHref = function(thisTarget) {
    var locationHash = window.location.hash;
    var thisHref = thisTarget.attr('href');
    // 如果 URL和 hash為同一頁，重新 load頁面
    if (locationHash == thisHref) {
        $('.main-page').empty().load('page/' + locationHash.split('#')[1] + '.html');
    }
};

/**
 * 判斷 hash並 load對應頁面
 * @param
 * @returns null
 */
loadHashNextPage = function() {
    if (hashCheck) {
        // 如果有循環事件存在，清除所有循環事件
        if (clearIntervalArray.length > 0) {
            clearAllSetInterval();
        }
        var page = window.location.hash.split('#')[1];
        if (pageArray.indexOf(page) != -1) {
            var nextPage;
            if (pageArray.indexOf(page) == (pageArray.length - 1)) {
                nextPage = pageArray[0];
            } else {
                nextPage = pageArray[pageArray.indexOf(page) + 1];
            }
            console.log('pageArray.indexOf(page) = ' + pageArray.indexOf(page));
            console.log('nextPage = ' + nextPage);
            window.location.hash = nextPage;
        } else {
            // 如果hash不存在或不符，跳轉至錯誤頁面
            $('.main-page').empty().load('page/wrong_page.html');
        }
    }
};

/**
 * 判斷 hash並 load對應頁面
 * @param
 * @returns null
 */
scrollLoadPageFunction = function() {
    doingSetTimeout = false;
    touchmoveTimes = 0;
    lastTouchmoveY = 0;
    $('body').bind('touchstart', function(e) {
        touchStartY = e.originalEvent.touches[0].clientY;
    });
    $('body').bind('touchmove', function(e) {
        if (!scrollLoadPage || typeof($('.page')) == 'undefined' || typeof($('.page').css("padding-top")) == 'undefined' || typeof($('.page').css("padding-bottom")) == 'undefined') {
            return;
        }
        // 判斷捲至底部
        var pageBody = $('.page-body').outerHeight() + Number($('.page').css("padding-top").split('px')[0]) + Number($('.page').css("padding-bottom").split('px')[0]) + Number($('.main-page').css("padding-top").split('px')[0]); // 上下 padding共57
        var windowHeight = $(window).height(); // 上 padding 62
        var scrollTop = $('.page').scrollTop();
        var scrollBottom = pageBody - windowHeight - scrollTop;
        var leastHeight = 10;
        var thisPage = window.location.hash.split('#')[1];
        var thisTouchmoveY = e.originalEvent.touches[0].clientY;
        var differentTouchmoveH = touchStartY - thisTouchmoveY;
        if (scrollBottom < leastHeight && scrollBottom == lastScroll && differentTouchmoveH >= 200) {
            $('.footer .fa.fa-angle-double-down').addClass('hide');
            $('.footer .fa.fa-circle-o-notch').removeClass('hide');
            if (!doingSetTimeout) {
                doingSetTimeout = true;
                setTimeout(function() {
                    var nowPage = window.location.hash.split('#')[1];
                    if (nowPage == thisPage) {
                        loadHashNextPage();
                    }
                    doingSetTimeout = false;
                }, 1000);
            }
            touchmoveTimes += 1;
            if (touchmoveTimes > 10) {
                loadHashNextPage();
            }
        } else if (touchmoveTimes != 0) {
            $('.footer .fa.fa-angle-double-down').removeClass('hide');
            $('.footer .fa.fa-circle-o-notch').addClass('hide');
            touchmoveTimes = 0;
        }
        lastScroll = scrollBottom;
    });

    lastScroll = $('.page').scrollTop();
    $('body').bind('mousewheel', function(e) {
        if (!scrollLoadPage || typeof($('.page')) == 'undefined' || typeof($('.page').css("padding-top")) == 'undefined' || typeof($('.page').css("padding-bottom")) == 'undefined') {
            return;
        }
        // 判斷捲至底部
        var pageBody = $('.page-body').outerHeight() + Number($('.page').css("padding-top").split('px')[0]) + Number($('.page').css("padding-bottom").split('px')[0]) + Number($('.main-page').css("padding-top").split('px')[0]); // 上下 padding共57
        var windowHeight = $(window).height(); // 上 padding 62
        var scrollTop = $('.page').scrollTop();
        var scrollBottom = pageBody - windowHeight - scrollTop;
        var leastHeight = 10;
        var thisPage = window.location.hash.split('#')[1];
        if (scrollBottom < leastHeight && scrollBottom == lastScroll && e.originalEvent.wheelDelta < 0) {
            $('.footer .fa.fa-angle-double-down').addClass('hide');
            $('.footer .fa.fa-circle-o-notch').removeClass('hide');
            if (!doingSetTimeout) {
                doingSetTimeout = true;
                setTimeout(function() {
                    var nowPage = window.location.hash.split('#')[1];
                    if (nowPage == thisPage) {
                        loadHashNextPage();
                    }
                    doingSetTimeout = false;
                }, 1000);
            }
            touchmoveTimes += 1;
            if (touchmoveTimes > 5) {
                loadHashNextPage();
            }
        } else if (touchmoveTimes != 0) {
            $('.footer .fa.fa-angle-double-down').removeClass('hide');
            $('.footer .fa.fa-circle-o-notch').addClass('hide');
            touchmoveTimes = 0;
        }
        lastScroll = scrollBottom;
    });
};
