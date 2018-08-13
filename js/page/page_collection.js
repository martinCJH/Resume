$(document).ready(function() {
    $('title').attr('data-lang-tx', 'page_collection');
    // 匯入文案
    changeLang();
    scrollLoadPage = true;
    $('.slide-group').each(function() {
        addSlideItems($(this));
    });
    setTimeout(function() {
        $('.slide-group').each(function() {
            refreshSlideItemPos($(this));
        });
    }, 1000);
});

scrollLoadPage = false;

/**
 * 處理資料並設定輪播
 * @param data 來源資料
 * @returns null
 */
addSlideItems = function(target) {
    // 定義，是否正在進行輪播切換
    doingSlide = false;
    // 定義，輪播項目數
    var slideLength = target.find('.slide-item').length;
    if (slideLength == 1) {
        return;
    }
    // 定義，單項目的寬
    var slideWidth = target.width();
    target.find('.slide-item').css('width', slideWidth);
    // 新增"上一張"、"下一張"輪播按鈕
    target.append(
        '<button type="button" class="btn btn-default btn-cus-deep slide-btn circle btn-cus-deep hide" data-slide-btn="pref"><</button>' +
        '<button type="button" class="btn btn-default btn-cus-deep slide-btn circle btn-cus-deep hide" data-slide-btn="next">></button>'
    );
    target.find('.slide-item').eq(0).addClass('active');
    // 各項目處理
    for (var i = 0; i < slideLength; i++) {
        target.find('.slide-item').eq(i).attr('data-slide-num', i);
    }
    lastWindowWidth = $(window).width();
    // 事件監聽，當視窗大小改變，重新定義輪播設定(響應式)
    $(window).bind('resize', function() {
        var thisWindowWidth = $(window).width();
        if (lastWindowWidth != thisWindowWidth) {
            lastWindowWidth = thisWindowWidth;
            var thisSetInterval = setInterval(function() {
                $('.slide-group').each(function() {
                    refreshSlideItemPos($(this));
                });
            }, 10);
            setTimeout(function() {
                clearInterval(thisSetInterval);
            }, 500);
        }
    });
    // 當輪播按鈕按下時
    target.find('.slide-btn').on('click', function() {
        if ($(this).hasClass('slide-changing')) {
            return;
        }
        var target = $(this).parents('.slide-group');
        var slideLength = target.find('.slide-item').length;
        target.find('.slide-btn').addClass('slide-changing');
        var nextTarget;
        // 按鈕取消 focus
        $(this).blur();
        // 如果正在切換輪播項目，就跳過執行
        // 定義，正在進行輪播切換
        var w = target.width();
        var operation = $(this).attr('data-slide-btn');
        var thisTarget = Number(target.find('.slide-item.active').attr('data-slide-num'));
        target.find('[data-slide-num=' + thisTarget + ']').removeClass('active');

        // 如果按下的按鈕為"next"或"pref"
        if (operation == 'next') {
            // 設定下一個輪播項目 id
            nextTarget = thisTarget + 1;
            if (nextTarget >= slideLength) {
                nextTarget = 0;
            }
            target.find('[data-slide-num=' + nextTarget + ']').addClass('active');
            var theChange = w * nextTarget * -1;

            target.find('.slide-item').animate({
                textIndent: 100
            }, {
                step: function() {
                    $(this).css('-webkit-transition', '.5s');
                    $(this).css('transition', '.5s');
                    $(this).css('transform', 'translate(' + theChange + 'px)');
                },
                duration: 500,
                complete: function() {
                    $(this).css('-webkit-transition', '.0s');
                    $(this).css('transition', '.0s');
                    target.find('.slide-btn').removeClass('slide-changing');
                }
            });
        } else {
            // 設定上一個輪播項目 id
            var prefTarget = thisTarget - 1;
            if (prefTarget <= -1) {
                prefTarget = slideLength - 1;
            }
            target.find('[data-slide-num=' + prefTarget + ']').addClass('active');
            var theChange = w * prefTarget * -1;

            target.find('.slide-item').animate({
                textIndent: 100
            }, {
                step: function() {
                    $(this).css('-webkit-transition', '.5s');
                    $(this).css('transition', '.5s');
                    $(this).css('transform', 'translate(' + theChange + 'px)');
                },
                duration: 500,
                complete: function() {
                    $(this).css('-webkit-transition', '.0s');
                    $(this).css('transition', '.0s');
                    target.find('.slide-btn').removeClass('slide-changing');
                }
            });
        }
    });
};

/**
 * 重新刷新處理所有輪播項目的位置
 * @param
 * @returns null
 */
refreshSlideItemPos = function(target) {
    // 定義輪播寬
    var w = target.outerWidth();
    var h = target.height() / 2 - target.find('.slide-btn').eq(0).outerHeight() / 2;
    var theChange = w * Number(target.find('.slide-item.active').attr('data-slide-num')) * -1;
    target.find('.slide-btn').css('top', h);
    target.find('.slide-item').css('width', w).css('transform', 'translate(' + theChange + 'px)');
    if (target.find('.slide-btn').hasClass('hide')) {
        target.find('.slide-btn').removeClass('hide');
    }
};
