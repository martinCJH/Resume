jQuery(document).ready(function($) {
    $('title').attr('data-lang-tx', 'page_demo');
    // 匯入文案
    changeLang();
    scrollLoadPage = true;
    changeDemoLangPre();
    prettyPrint();

    // 顯示讀取畫面
    $('.loading-page').fadeIn('slow', function() {
        // 創建 Google Map
        initMap();
        // 隱藏讀取畫面
        $('.loading-page').fadeOut('slow');
    });

    $('#demo_lang_input').on('keyup', function() {
        var val = $(this).val();
        $('#demo_lang').html('').attr('data-lang-tx', val);
        changeDemoLangPre();
    });

    $('#demo_lang_btn').on('click', '.btn', function() {
        var val = $(this).html();
        $('#demo_lang_input').val(val);
        $('#demo_lang').html('').attr('data-lang-tx', val);
        changeDemoLangPre();
    });

    $('#demo_4_btn').on('click', function() {
        $('.loading-page').fadeIn('slow');
        var url = './test/listData';
        var option = {
            'url': url
        };
        $('#demo_4_url').removeAttr('data-lang-tx').html(url);
        doAjax(option, function(data, status) {
            if (status != '' && status == 'success') {
                $('#demo_4 tbody').html('');
                var tableData;
                for (var i = 0; i < data.length; i++) {
                    var name = data[i].name;
                    var sex = data[i].sex;
                    var number = data[i].number;
                    tableData += '<tr>' +
                        '<td>' + name + '</td>' +
                        '<td>' + sex + '</td>' +
                        '<td>' + number + '</td>' + '</tr>';
                }
                $('#demo_4 tbody').append(tableData);
                $('#demo_4_data').html(JSON.stringify(data)).removeClass('prettyprinted');
                prettyPrint();
                $('.loading-page').stop().fadeOut('slow');
            }
        });
    });
});

scrollLoadPage = false;

/**
 * 創建 Google Map
 * @param
 * @returns null
 */
initMap = function() {
    // 創建，所有 Mareker對象數組
    markers = [];
    map = new google.maps.Map(document.getElementById('map'), {
        center: CF_DEFAULT_POS,
        zoom: CF_DEFAULT_MAP_ZOOM
    });
};

/**
 * 創建 Google Map
 * @param
 * @returns null
 */
changeDemoLangPre = function() {
    var el = $('<div/>').text($('#demo_lang')[0].outerHTML).html();
    $('#demo_lang_pre').removeClass('prettyprinted').html(el);
    prettyPrint();
    changeLang();
};
