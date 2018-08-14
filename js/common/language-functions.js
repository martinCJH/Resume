jQuery(document).ready(function($) {
    // 獲取語言檔案資訊
    $.ajax({
        url: './js/resource',
        async: false,
        success: function(data) {
            $(data).find("a:contains(.json)").each(function() {
                var fileName = $(this).attr("href").split('.')[0];
                langArray.push(fileName);
                langName = languageList[fileName];
                if (langName == undefined) {
                    langName = fileName;
                }
                var el = '<li><a class="custom-link" data-lang="' + fileName + '">' + langName + '</a></li>';
                $('#change_lang_group .dropdown-menu').append(el);
            });
        }
    });

    $('#change_lang_group .dropdown-menu').on('click', '[data-lang]', function() {
        var lang = $(this).attr('data-lang');
        if (lang != lastLang) {
            addCookie('lang', lang);
            console.warn('change lang => ' + lang);
            $('[data-lang-tx]').each(function() {
                $(this).html('');
            });
            changeLang(lang);
        }
    });
});

// 創建，獲取的JOSN檔
var langData;
// 定義，可使用的語言
var langArray = [];
// 創建，最後所定義的語言
var lastLang;

/**
 * 執行語言判斷並匯入文案
 * @param
 * @returns null
 */
changeLang = function(lang) {
    var path;
    if (lang == undefined) {
        if (!getCookieValue('lang')) {
            lang = (navigator.language || navigator.browserLanguage).replace(/-/g, '_');
            console.log('browserLanguage = ' + lang);
            addCookie('lang', lang);
        } else {
            lang = getCookieValue('lang');
            console.log('cookieLanguage = ' + lang);
        }
    }

    if (langArray.indexOf(lang) == -1) {
        lang = CF_DEFAULT_LANGUAGE;
        // 定義，預設語言
        addCookie('lang', lang);
        console.warn('change lang => ' + lang);
    }
    path = './js/resource/' + lang + '.json';
    lastLang = lang;
    setDataTableLang(lang);
    $('#change_lang_group [data-lang=' + lang + ']').parent().addClass('active').siblings().removeClass('active');

    // 匯入文案
    $.ajax({
        url: path,
        error: function(data) {
            // 判斷全部有 data-lang-tx值的 html元素顯示各自的 lang key
            $('[data-lang-tx]').each(function() {
                var placeholder;
                var thisLang = $(this).attr('data-lang-tx');
                var tagName = $(this).prop('tagName');
                if (tagName != 'INPUT' && tagName != 'TEXTAREA') {
                    $(this).html('"' + thisLang + '"');
                } else if (tagName == 'INPUT' || tagName == 'TEXTAREA') {
                    placeholder = $(this).attr('placeholder');
                    $(this).attr('placeholder', '"' + thisLang + '"');
                }
            });
        },
        success: function(data) {
            langData = data;
            // 將所有文案，匯入至對應的 html
            for (var langTarget in data) {
                // 如果此 lang key前面有 input_，文案將匯入 placeholder
                var langTargetInput = langTarget.split('input_')[0];
                if (langTargetInput == "") {
                    $('[data-lang-tx=' + langTarget + ']').attr('placeholder', langData[langTarget]);
                } else {
                    $('[data-lang-tx=' + langTarget + ']').html(langData[langTarget]);
                }
            }

            // 判斷全部有 data-lang-tx值的 html元素，如果無此文案，顯示各自的 lang key
            $('[data-lang-tx]').each(function() {
                var placeholder;
                var thisLang = $(this).attr('data-lang-tx');
                var tagName = $(this).prop('tagName');
                if ($(this).html() == '' && thisLang != '' && tagName != 'INPUT' && tagName != 'TEXTAREA') {
                    $(this).html('"' + thisLang + '"');
                } else if (tagName == 'INPUT' || tagName == 'TEXTAREA') {
                    placeholder = $(this).attr('placeholder');
                    if (placeholder == '') {
                        $(this).attr('placeholder', '"' + thisLang + '"');
                    }
                }
            });
        }
    });
};

/**
 * 將字串轉換文案，如果文案不存在，以 "lang key"格式顯示
 * @param langKey 判斷的 lang key值
 * @returns 文案或 "lang key"
 */
makeLang = function(langKey) {
    if (typeof(langKey) != 'undefined' && typeof(myLangArray) != 'undefined') {
        var text = langData[langKey];
        if (text != undefined) {
            return text;
        } else {
            return '"' + langKey + '"';
        }
    }
};

/**
 * 設置 DataTable的文案為一個變數
 * @param lang 判斷的遠言
 * @returns
 */
setDataTableLang = function(lang) {
    if (lang == 'zh_TW') {
        dataTableLang = {
            "sProcessing": "處理中...",
            "sLengthMenu": "每頁 _MENU_ 項",
            "sZeroRecords": "沒有匹配結果",
            "sInfo": "當前顯示第 _START_ 至 _END_ 項，共 _TOTAL_ 項。",
            "sInfoEmpty": "當前顯示第 0 至 0 項，共 0 項",
            "sInfoFiltered": "(由 _MAX_ 項結果過濾)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中數據為空",
            "sLoadingRecords": "載入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首頁",
                "sPrevious": "<",
                "sNext": ">",
                "sLast": "末頁",
                "sJump": "跳轉"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        };
    } else {
        dataTableLang = {
            "sProcessing": "Processing...",
            "sLengthMenu": "Show _MENU_ entries",
            "sZeroRecords": "No matching records found",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
            "sInfoEmpty": "Showing 0 to 0 of 0 entries",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sSearch": "Search:",
            "sUrl": "",
            "sEmptyTable": "No data available in table",
            "sLoadingRecords": "Loading...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "First",
                "sPrevious": "<",
                "sNext": ">",
                "sLast": "Last"
            },
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            }
        };
    }
};
