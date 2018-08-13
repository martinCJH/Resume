jQuery(document).ready(function($) {
    $('title').attr('data-lang-tx', 'wrong_page');
    // 匯入文案
    changeLang();
    var countdown = CF_PAGE_COUNTDOWN;
    $('#back_main_page_countdown').html(countdown);

    var countdownInterval = setInterval(function() {
        countdown -= 1;
        if (countdown >= 0) {
            $('#back_main_page_countdown').html(countdown);
        }
    }, 1000);
    clearIntervalArray.push(countdownInterval);

    setTimeout(function() {
        window.location.hash = '#' + pageArray[0];
    }, CF_PAGE_COUNTDOWN * 1000);
});
