/**
 * 重写ajax load方法，在url后面添加时间参数，禁止浏览器页面缓存
 */
//先备份下jquery的load方法
var _load = $.fn.load;
$.fn.extend({
    load: function (url, param, calbck) {
        //其他操作和处理
        if (url.indexOf("?") > -1) {
            url = url + "&random=" + parseInt(Math.random() * 100000);
        } else {
            url = url + "?random=" + parseInt(Math.random() * 100000);
        }
        var newCallback = function () {
            calbck();
            initSelect2();
        };
        //此处用apply方法调用原来的load方法，因为load方法属于对象，所以不可直接对象._load（...）
        return _load.apply(this, [url, param, calbck]);
    }
});

$.ajaxSetup({
    statusCode: {
        301: function (data, textStatus) {
            console.log(data);
            advanceAlert("当前在账号信息失效,请重新绑定账号!",function () {
                // window.location.href =data;
            });
        }
    }
});

/**
 * 重写jquery的val方法
 */
$.prototype.val = function (base) {
    return function () {
        var s = this, isset = arguments.length > 0, v = isset ? arguments[0] : null;
        //这里调用基类方法，当然基类方法在何时调用或者是否要调用取决于您的业务逻辑，在这里我们是要调用的，因为要保持它原有的功能。
        if (isset && typeof(base) == "function") {
            base.call(s, v);
            if (s.is("select")) {
                pickout.updated("select");
            }
        } else {
            v = base.call(s);
            return v;
        }
    }
    //在这里传入基类方法
}($.prototype.val);


$(function () {
    initSelect2();
});

// function initCommonWebSocket(path, callback) {
//     var sock = new SockJS(getRootPath() + path);
//     sock.onopen = function () {
//         console.log('open websocket ' + path);
//     };
//     sock.onmessage = function (e) {
//         callback(e.data);
//     };
//     sock.onclose = function () {
//         console.log('close websocket ' + path);
//     };
//     return sock;
// }


function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(0);
}


function advanceToolTip(objList, attr1, attr2, tipMsg, callback) {
   var template = '<div class="js_dialog" id="toolTip" style="opacity: 1;">\n' +
       '  <div class="weui-mask"></div>\n' +
       '  <div class="weui-dialog weui-skin_android">\n' +
       '    <div class="weui-dialog__bd" id="resultMsg">\n';

   var str ='<div class="weui-form-preview">\n' + '<div style=\'color: red;font-size: 10px;padding: 5px 5px\'>' + tipMsg + '</div>' ;

   for (var d in objList) {
      str += '  <div class="weui-form-preview__bd" style="padding: 0px 15px;">\n' +
          '    <div class="weui-form-preview__item">\n' +
          '      <label class="weui-form-preview__label" style="font-size: 10px;">' + objList[d][attr1] + '</label>\n' +
          '      <span class="weui-form-preview__value" style="font-size: 10px;">' + (objList[d][attr2].length == 8 ? formatTime(objList[d][attr2]) : objList[d][attr2]) + '</span>\n' +
          '    </div>\n' +
          '  </div>\n';

   }
   str += '</div>';

   template += str;

   template += '    </div>\n' +
       '    <div class="weui-dialog__ft">\n' +
       '      <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" id="sureBtn">确定</a>\n' +
       '    </div>\n' +
       '  </div>\n' +
       '</div>';
   var $template = $(template);
   $template.appendTo("body");
   $template.find("#sureBtn").on('click', function () {
      $template.remove();
      if (callback){
         callback();
      }
   });

}

function advanceConfirm(message, callback) {
    var template = "<div class=\"js_dialog\"  style=\"opacity: 1;\">\n" +
        "            <div class=\"weui-mask\"></div>\n" +
        "            <div class=\"weui-dialog weui-skin_android\">\n" +
        "                <div class=\"weui-dialog__bd\">\n" +
        "                   " + message + "\n" +
        "                </div>\n" +
        "                <div class=\"weui-dialog__ft\">\n" +
        "                    <a href=\"javascript:;\" class=\"weui-dialog__btn weui-dialog__btn_default\">取消</a>\n" +
        "                    <a href=\"javascript:;\" class=\"weui-dialog__btn weui-dialog__btn_primary\">确定</a>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>";
    var $template = $(template);
    $template.appendTo("body");

    $template.find(".weui-dialog__btn_default").on('click', function () {
        $template.remove();
    });

    $template.find(".weui-dialog__btn_primary").on('click', function () {
        $template.remove();
        if (callback)
            callback();

    });
}

/**
 * 加载提示框，提示信息5字以内，否则样式会显示异常
 * @param message
 * @returns {clsoe}
 */
function advanceLoading(message) {
    var template = '<div  style="opacity: 1; display: block;">\n' +
        '        <div class="weui-mask_transparent"></div>\n' +
        '        <div class="weui-toast">\n' +
        '            <i class="weui-loading weui-icon_toast"></i>\n' +
        '            <p class="weui-toast__content">' + message + '</p>\n' +
        '        </div>\n' +
        '    </div>';


    var $template = $(template);
    $template.appendTo("body");

    var clsoe = function () {
        $template.remove();
    }
    return clsoe;
}

function advanceAlert(message, callback) {
    var template = "<div class=\"js_dialog\"  style=\"opacity: 1;\">\n" +
        "            <div class=\"weui-mask\"></div>\n" +
        "            <div class=\"weui-dialog weui-skin_android\">\n" +
        "                <div class=\"weui-dialog__bd\">\n" +
        "                   " + message + "\n" +
        "                </div>\n" +
        "                <div class=\"weui-dialog__ft\">\n" +
        "                    <a href=\"javascript:;\" class=\"weui-dialog__btn weui-dialog__btn_primary\">确定</a>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>";
    var $template = $(template);
    $template.appendTo("body");

    $template.find(".weui-dialog__btn_primary").on('click', function () {
        if (callback)
            callback();
        $template.remove();
    });
}


function initSelect2() {
    // $("select").select2({
    //    width:"100%"
    // });

    // $("select").each(function (i,n) {
    pickout.to({
        el: 'select:not(:disabled)',
        search: true
    });
    // });

    $("select").on("change", function (e) {

        // pickout.to({
        //     el:'select',
        //     search: true
        // });

        pickout.updated('select:not(:disabled)');

    });
}

/**
 * 格式化时间
 * @param time
 * @returns {*}
 */
function formatTime(time) {
    if (time == null || time == "")
        return "";

    var year, month, day, hour, minute, second;
    if (/^\d{8}$/.test(time)) {
        year = time.substring(0, 4);
        month = time.substring(4, 6);
        day = time.substring(6, 8);
        return year + "-" + month + "-" + day;
    }
    if (/^\d{6}$/.test(time)) {
        hour = time.substring(0, 2);
        minute = time.substring(2, 4);
        second = time.substring(4, 6);
        return hour + ":" + minute + ":" + second;
    }

    if (/^\d{14}$/.test(time)) {
        year = time.substring(0, 4);
        month = time.substring(4, 6);
        day = time.substring(6, 8);
        hour = time.substring(8, 10);
        minute = time.substring(10, 12);
        second = time.substring(12, 14);
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }

    return "";
}

/**
 *  页面没有查询出数据显示的div
 * @param msg 显示的信息
 * @returns {string} div字符串用于append
 */
function getNoDataDiv(msg) {
    return '<div class="noDataDiv" style="height: 100px;width: 100%;text-align: center;line-height: 100px">\n' +
        msg +
        '    </div>';
}


/**
 *
 * @param price
 * @returns {boolean}
 * true: pass
 * false：unpass
 */
function regPrice(price) {
    var reg = /^(([1-9]\d*)(\.\d{1,2})?|0\.\d[1-9]|0\.[1-9]\d?)$/;
    return reg.test(price);
}