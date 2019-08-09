window.alert = function (message, title, callback) {
    if (title == null) {
        title = '提示';
    } else if (typeof (title) == 'function') {
        callback = title;
        title = '提示';
    }
    var content = $("<div>" + message + "</div>")[0];
    swal({
        content: content,
        icon: ""
    }).then(function (value) {
        if (callback)
            callback(1);
    });
};

/**
 * 导入excel 插件
 * @param options eg: CardConsumerMakeIndex.html
 *
 */
$.fn.uploader = function (options) {

    var defaults = {
        size: "", //modal-lg
        title: "excel导入",
        progress: true,
        websocket: {
            open: true,
            path: "",
            callback: function (data, uploadApi) {

            }
        },
        ajaxUpload: {
            dataType: "json"
        }
    }
    var configs = $.extend(defaults, options);

    var modal = $('<div class="modal fade"/>')
        .append($('<div class="modal-dialog ' + configs.size + ' " style=""/>')
            .append($('<div class="modal-content" />')
                .append(
                    $('<div class="modal-body "/>')
                )
            )
        )
        .appendTo('body');

    var modal_head = $("<div class='modal-header'>" + configs.title + " <i class=\"ace-icon fa fa-close bigger-130 pull-right\" data-dismiss=\"modal\" style=\"cursor: pointer;\"></i></div>");
    var modal_foot = $("<div class='modal-footer'></div>");

    modal.find(".modal-content").prepend(modal_head);
    modal.find(".modal-content").append(modal_foot);

    var modal_body = modal.find(".modal-body");

    for (var i in configs.excel_modals) {
        var btn;
        if (configs.excel_modals[i].path)
            btn = $("<a href=\"" + getRootPath() + "/" + configs.excel_modals[i].path + "\" class=\"btn btn-xs btn-warning pull-right m-t-n-xs\" type=\"button\" style='margin-right: 10px'><strong>" + configs.excel_modals[i].name + "</strong></a>");
        else {
            btn = $("<a  class=\"btn btn-xs btn-warning pull-right m-t-n-xs\" type=\"button\" style='margin-right: 10px'><strong>" + configs.excel_modals[i].name + "</strong></a>");
            btn.on("click", function () {
                configs.excel_modals[i].click();
            });
        }
        modal_body.append(btn);
    }

    modal_body.append("<div style='clear: both;'></div>")

    var inputFile = $("<input type='file' />");

    modal_body.append(inputFile);

    modal_body.append("<hr/>");
    var progressbar;

    if (configs.progress) {
        progressbar = $("<div class=\"progress progress-bar-default\" ><div style=\"width: 0%\" aria-valuemax=\"100\" aria-valuemin=\"0\" aria-valuenow=\"43\" role=\"progressbar\" class=\"progress-bar progress_precent\" > <span  class='progress_html'>0%完成</span></div></div>");
        modal_body.append(progressbar);
    }


    var detail = $("<div><div class=\"excelTool\" style=\" position: absolute;right: 50px;top: 10px;\"></div><div class=\"detail\" style=\"overflow-y: auto; max-height: 200px;\"></div></div>");
    modal_body.append(detail);

    var closeBtn = $("<button  class=\"btn btn-sm btn-default m-t-n-xs\" type=\"button\">关闭</button>");
    var saveBtn = $("<button  class=\"btn btn-sm btn-primary  m-t-n-xs\" type=\"button\">确定上传</button>");
    var emptyBtn = $("<button class=\"btn btn-sm btn-primary  m-t-n-xs\" type=\"button\">清空结果</button>");
    var copyBtn = $("<button class=\"btn btn-sm btn-primary  m-t-n-xs\" type=\"button\">复制结果</button>");

    modal_foot.append(emptyBtn);
    modal_foot.append(copyBtn);
    modal_foot.append(saveBtn);
    modal_foot.append(closeBtn);

    var set_progress_precent = function (precent) {
            if (progressbar)
                progressbar.find(".progress_precent").css("width", precent);
        },
        set_progress_html = function (text) {
            if (progressbar)
                progressbar.find(".progress_html").html(text);
        },
        append_detail_message = function (text) {
            detail.find(".detail").prepend(text);
        },
        clear_file = function () {
            inputFile.val('');
        },
        clear_detail = function () {
            detail.find(".detail").empty();
        },
        clear_progress = function () {
            if (progressbar) {
                progressbar.find(".progress_precent").css("width", 0);
                progressbar.find(".progress_html").html('');
            }
        },
        show = function () {
            if (configs.progress)
                clear_progress();
            clear_detail();
            clear_file();
            modal.modal({'backdrop': 'static'});
        },
        hide = function () {
            modal.modal('hide');
        }
    ;


    var uploadApi = {
        set_progress_precent: set_progress_precent,
        set_progress_html: set_progress_html,
        append_detail_message: append_detail_message,
        clear_file: clear_file,
        clear_detail: clear_detail,
        clear_progress: clear_progress,
        show: show,
        hide: hide
    }

    if (configs.progress) {
        inputFile.bind("change", function () {
            clear_progress();
        });
    }

    saveBtn.on("click", function f() {
        clear_detail();

        if (progressbar) {
            clear_progress();
            progressbar.remove();
            detail.before(progressbar);
        }


        if (inputFile.val() == "") {
            toastr.error("请先选择文件");
            return;
        }
        var filename = inputFile.val();
        var fileSuffix = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        if (fileSuffix == "xls" || fileSuffix == "xlsx") {

        } else {
            toastr.error("请选择excel文件");
            return;
        }
        saveBtn.addClass("disabled");
        var deferred = new $.Deferred
        if ("FormData" in window) {
            var formData_object = new FormData();
            var files = inputFile[0].files[0];
            formData_object.append("file", files);
            deferred = $.ajax({
                url: getRootPath() + configs.ajaxUpload.url,
                type: 'POST',
                asyn: false,
                processData: false,//important
                contentType: false,//important
                timeout: 300000,
                dataType: configs.ajaxUpload.dataType,
                data: formData_object,
                success: function (data) {
                    saveBtn.removeClass("disabled");
                    if (configs.ajaxUpload.callback) {
                        configs.ajaxUpload.callback(data);
                    }
                }
            });
        } else {
        }
        deferred.promise();
    });

    emptyBtn.on("click", function () {
        clear_detail();
    });

    copyBtn.on("click", function () {
        var emailLink = detail.find(".detail")[0];
        var range = document.createRange();
        range.selectNode(emailLink);
        window.getSelection().addRange(range);
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
        } catch (err) {
        }
        window.getSelection().removeAllRanges();
    });

    closeBtn.on('click', function () {
        uploadApi.hide();
    })

    if (configs.websocket.open) {
        initCommonWebSocket(configs.websocket.path, function (data) {
            configs.websocket.callback(data, uploadApi);
        });
    }

    this.on("click", function () {
        uploadApi.show();
    });

    return uploadApi;
}


$.fn.printDataTable = function () {
    var printArea = $(this).clone(true);
    printArea.find("table").addClass("printTable");
    printArea.printArea();
    printArea.remove();
}

window.myconfirm = function (message, callback, title) {
    if (!title) title = '提示';
    bootbox.dialog({
        message: message,
        title: title,
        buttons: {
            Cancel: {
                label: "取消",
                className: "btn-default btn-sm",
                callback: function () {
                }
            },
            OK: {
                label: "确定",
                className: "btn-primary btn-sm",
                callback: function () {
                    if (typeof (callback) == 'function') callback();
                }
            }
        }
    });
};
/**
 * 重写ajax load方法，在url后面添加时间参数，禁止浏览器页面缓存
 */
//先备份下jquery的load方法
var _load = $.fn.load;
$.fn.extend({
    load: function (url, param, calbck) {
        //提货单据管理的打印
        if (url.indexOf("#content-table") != -1) {
            return _load.apply(this, [url, param, calbck]);
        }
        //其他操作和处理
        if (url.indexOf("?") > -1) {
            url = url + "&random=" + parseInt(Math.random() * 100000);
        } else {
            url = url + "?random=" + parseInt(Math.random() * 100000);
        }
        //此处用apply方法调用原来的load方法，因为load方法属于对象，所以不可直接对象._load（...）
        return _load.apply(this, [url, param, calbck]);
    }
});

//由于js乘法精度缺失的问题
//调用该方法来获取乘法
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

function accAdd(num1, num2) {
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
}

/**
 *  返回当天日期的字符串 yyyy-MM-dd
 * @returns {string}
 */
function getTodayStr() {
    function formateMonthAndDate(str) {
        if (parseInt(str) < 10) {
            str = "0" + str;
        }
        return str;
    }

    var d = new Date();
    var todayStr = d.getFullYear() + "-" + formateMonthAndDate((d.getMonth() + 1)) + "-" + formateMonthAndDate(d.getDate());
    return todayStr;
}

function formatTime(str) {
    if (str && str.length >= 14) {
        var y = str.substr(0, 4),
            M = str.substr(4, 2),
            d = str.substr(6, 2),
            h = str.substr(8, 2),
            m = str.substr(10, 2),
            s = str.substr(12, 2);
        return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
    }
    return str;
}

(function ($) {


    $.fn.formatTime = function (str) {
        if (str && str.length >= 14) {
            var y = str.substr(0, 4),
                M = str.substr(4, 2),
                d = str.substr(6, 2),
                h = str.substr(8, 2),
                m = str.substr(10, 2),
                s = str.substr(12, 2);
            return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
            ;
        }
        return str;
    }

    //div的动态影藏和显示
    $.fn.leftShow = function () {
        var $this = this;
        $this.addClass("animated");
        $this.removeClass("fadeOutLeft").removeClass("fadeOutRight").removeClass("fadeInRight")
            .addClass("fadeInLeft").removeClass("hide");

    }

    $.fn.leftHide = function () {
        var $this = this;
        $this.addClass("animated");
        $this.removeClass("fadeInLeft").removeClass("fadeInRight").removeClass("fadeOutRight")
            .addClass("fadeOutLeft").addClass("hide");
    }

    $.fn.rightShow = function () {
        var $this = this;
        $this.addClass("animated");
        $this.removeClass("fadeOutLeft").removeClass("fadeOutRight").removeClass("fadeInLeft")
            .addClass("fadeInRight").removeClass("hide");
    }

    $.fn.rightHide = function () {
        var $this = this;
        $this.addClass("animated");
        $this.removeClass("fadeInLeft").removeClass("fadeInRight").removeClass("fadeOutLeft")
            .addClass("fadeOutRight").addClass("hide");
    }


    /**
     * 回车监听事件
     * @param callBack
     */
    $.fn.enterListen = function (callBack) {
        var $this = this;
        $this.bind("keyup", function (e) {
            if (e.keyCode == 13) {
                callBack(e);
            }
        });
    }

    //x-editable

    $.fn.editableform.buttons =
        '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
        '<i class="fa fa-check"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
        '<i class="fa fa-close"></i>' +
        '</button>';


    /**
     * 封装 DataTable 初始化
     * @param options
     * @returns {*}
     */
    $.fn.advancedDataTable = function (options) {
        var $this = this;

        options = $.extend({}, {
            select: false,
            sAjaxSource: "",
            aoColumns: [],
            iDisplayLength: 10,
            "bPaginate": true,
            sDom: "rt<ip>",
            "fnServerData": function (data) {
                return data;
            },
            fnServerParams: function (aoData) {
            },
            fnDrawCallback: function (oSettings) {
            },
            fnHeaderCallback: function (nHead, aData, iStart, iEnd, aiDisplay) {
            },
            fnInitComplete: function (oSettings, json) {
            },
            oLanguage: {"sUrl": "jquery.dataTables.lang.zh-CN.txt"}
        }, options);

        var datatable = $this.dataTable({
            select: options.select,
            responsive: {
                details: {
                    type: 'column',
                    target: -1
                }
            },
            columnDefs: [{
                className: 'control',
                orderable: false,
                targets: -1
            }],
            "processing": true,
            "bSort": false, //去掉排序。
            "bStateSave": false, //客户端记录状态，讲状态数据写入cookies
            "bServerSide": true, //异步请求
            "bPaginate": options.bPaginate, //显示分页
            "bProcessing": true, //取消等待提示
            "bLengthChange": true, //不显示“每页显示多少条”的下拉框
            "bRetrieve": true, //允许重新生成表格
            "bAutoWidth": false, //自适应宽度
            "sAjaxSource": options.sAjaxSource,
            "sServerMethod": "GET",
            "bFilter": true,  //过滤功能
            "bInfo": true, //页脚信息
            "iDisplayStart": 0,
            "iDisplayLength": options.iDisplayLength,
            "aoColumns": options.aoColumns,
            "sDom": options.sDom,
            "fnServerData": function (sSource, aDataSet, fnCallback) {
                $.ajax({
                    "dataType": 'json',
                    "type": "GET",
                    "url": sSource,
                    "data": aDataSet,
                    "success": function (data) {
                        fnCallback(options.fnServerData(data));
                    }
                });
            },
            "fnServerParams": function (aoData) {
                options.fnServerParams(aoData);
            },
            "fnDrawCallback": function (oSettings) {
                if ($this.find('tr > th:first-child input:checkbox')[0]) {
                    $this.find('tr > th:first-child input:checkbox')[0].checked = false;
                    $this.find('tr > td:first-child input:checkbox').each(function () {
                        this.checked = false;
                    });
                }
                options.fnDrawCallback(oSettings);
                $this.find("a[data-rel=tooltip]").tooltip();
                var ipage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength);
                var TotalPages = Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength);
                var str = '<li><input size="10" class="form-control" style="width: 50px;height:28px;float: left;margin-right: 0.1px;border: 1px solid #DDDDDD;" type="text" value="' + (ipage + 1) + '" type="number"></li><li class="paginate_button"><a class="myPage btn btn-primary btn-xs" type="button" ipage="' + (ipage + 1) + '" totalPage="' + TotalPages + '" >跳转</a></li> ';
                $this.next().find('.dataTables_paginate ul').append(str);
                $this.next().find(".myPage").click(function () {
                    var target = this;
                    var oSettings = $this.fnSettings();
                    var $input = $(target).parent().prev().find("input");
                    var value = $input.val();
                    if (value == "") {
                        return;
                    }
                    var maxpage = $(target).attr("totalPage");
                    if (isNaN(value)) {
                        value = 0;
                        $input.val(1);
                    } else if (parseInt(value) > parseInt(maxpage)) {
                        value = maxpage - 1;
                        $input.val(maxpage);
                    } else if (value == 0) {

                    } else {
                        value--;
                    }
                    oSettings._iDisplayStart = (value) * oSettings._iDisplayLength;
                    oSettings.oApi._fnDraw(oSettings);
                });

            },
            "fnHeaderCallback": function (nHead, aData, iStart, iEnd, aiDisplay) {
                options.fnHeaderCallback(nHead, aData, iStart, iEnd, aiDisplay);
            },
            "fnInitComplete": function (oSettings, json) {
                options.fnInitComplete(oSettings, json);

            },
            "oLanguage": options.oLanguage
        });


        $this.on('click', 'tr > th:first-child input:checkbox', function () {
            var checked = this.checked;
            $this.find('tr > td:first-child input:checkbox').each(function () {
                this.checked = checked;
            });
        }).on('click', 'tr > td:first-child input:checkbox', function () {
            var totalCount = $this.find('tr > td:first-child input:checkbox').length;
            var selectCount = $this.find('tr > td:first-child input:checkbox:checked').length;
            $this.find('tr > th:first-child input:checkbox')[0].checked = (totalCount == selectCount);
        });

        datatable.getSelectedData = function () {
            var selectedData = [];
            $this.find('tr > td:first-child input:checkbox:checked').each(function () {
                selectedData.push(datatable.fnGetData($(this).closest('tr')));
            });
            return selectedData;
        };

        return datatable;
    };

    $.fn.advancedDataTableNoPage = function (options) {
        var $this = this;
        options = $.extend({}, {
            sAjaxSource: "",
            columns: [],
            sort: false,
            paginate: false,
            dom: "rt",
            select: false,
            searching: false,
            fnServerParams: function (aoData) {
            },
            fnDrawCallback: function (oSettings) {
            },
            fnHeaderCallback: function (nHead, aData, iStart, iEnd, aiDisplay) {
            },
            fnInitComplete: function (oSettings, json) {
            },
            "fnServerData": function (data) {
                return data;
            },
            oLanguage: {"sUrl": "jquery.dataTables.lang.zh-CN.txt"}
        }, options);

        var datatable = $this.dataTable({
            responsive: {
                details: {
                    type: 'column',
                    target: -1
                }
            },
            columnDefs: [{
                className: 'control',
                orderable: false,
                targets: -1
            }],
            select: options.select,
            searching: options.searching,
            "processing": true,
            "sort": options.sort, //去掉排序。
            "stateSave": false, //客户端记录状态，讲状态数据写入cookies
            "serverSide": true, //异步请求
            "paginate": options.paginate, //显示分页
            "bProcessing": true, //取消等待提示
            "bLengthChange": true, //不显示“每页显示多少条”的下拉框
            "bRetrieve": true, //允许重新生成表格
            "bAutoWidth": false, //自适应宽度
            "sAjaxSource": options.sAjaxSource,
            "columns": options.columns,
            "dom": options.dom,
            "fnServerData": function (sSource, aDataSet, fnCallback) {
                $.ajax({
                    "dataType": 'json',
                    "type": "GET",
                    "url": sSource,
                    "data": aDataSet,
                    "success": function (data) {
                        fnCallback(options.fnServerData(data));
                    }
                });
            },
            "fnServerParams": function (aoData) {
                options.fnServerParams(aoData);
            },
            "fnDrawCallback": function (oSettings) {
                if ($this.find('tr > th:first-child input:checkbox')[0]) {
                    $this.find('tr > th:first-child input:checkbox')[0].checked = false;
                    $this.find('tr > td:first-child input:checkbox').each(function () {
                        this.checked = false;
                    });
                }
                options.fnDrawCallback(oSettings);
                $this.find("a[data-rel=tooltip]").tooltip();
                var ipage = Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength);
                var TotalPages = Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength);
                var str = '<li><input size="10" class="form-control" style="width: 50px;height:28px;float: left;margin-right: 0.1px;border: 1px solid #DDDDDD;" type="text" value="' + (ipage + 1) + '" type="number"></li><li class="paginate_button"><a class="myPage btn btn-primary btn-xs" type="button" ipage="' + (ipage + 1) + '" totalPage="' + TotalPages + '" >跳转</a></li> ';
                $this.next().find('.dataTables_paginate ul').append(str);
                $this.next().find(".myPage").click(function () {
                    var target = this;
                    var oSettings = $this.fnSettings();
                    var $input = $(target).parent().prev().find("input");
                    var value = $input.val();
                    if (value == "") {
                        return;
                    }
                    var maxpage = $(target).attr("totalPage");
                    if (isNaN(value)) {
                        value = 0;
                        $input.val(1);
                    } else if (parseInt(value) > parseInt(maxpage)) {
                        value = maxpage - 1;
                        $input.val(maxpage);
                    } else if (value == 0) {

                    } else {
                        value--;
                    }
                    oSettings._iDisplayStart = (value) * oSettings._iDisplayLength;
                    oSettings.oApi._fnDraw(oSettings);
                });


            },
            "fnHeaderCallback": function (nHead, aData, iStart, iEnd, aiDisplay) {
                options.fnHeaderCallback(nHead, aData, iStart, iEnd, aiDisplay);
            },
            "fnInitComplete": function (oSettings, json) {
                options.fnInitComplete(oSettings, json);
            },
            "oLanguage": options.oLanguage
        });

        $this.on('click', 'tr > th:first-child input:checkbox', function () {
            var checked = this.checked;
            $this.find('tr > td:first-child input:checkbox').each(function () {
                this.checked = checked;
            });
        }).on('click', 'tr > td:first-child input:checkbox', function () {
            var totalCount = $this.find('tr > td:first-child input:checkbox').length;
            var selectCount = $this.find('tr > td:first-child input:checkbox:checked').length;
            $this.find('tr > th:first-child input:checkbox')[0].checked = (totalCount == selectCount);
        });

        datatable.getSelectedData = function () {
            var selectedData = [];
            $this.find('tr > td:first-child input:checkbox:checked').each(function () {
                selectedData.push(datatable.fnGetData($(this).closest('tr')));
            });
            return selectedData;
        };
        return datatable;
    };

    /**
     * ztree的通讯录插件
     * 使用方法：
     $("#treediv").myztree({
	   		basePath: '',
			onClick: function(id, usercode, username) { } // 回调函数
		})
     */
    $.fn.myztree = function (options) {
        var $this = this;
        var selectedDataId = null; // 选中机构节点的id

        options = $.extend({}, {
            basePath: "",
            onClick: function (id, usercode, username) {
            }
        }, options);

        $this.html(
            '<input class="form-control input-sm inline width-70">' +
            '<span class="blue" style="cursor:pointer">查询</span>' +
            '<ul id="ztree_' + $this.attr('id') + '" class="ztree"></ul>' +
            '<ul class="nav no-margin"></ul>');

        var getData = function () {
            $this.children('.nav').html('');
            if ($this.children("input").val() == '' && $this.ztree.getSelectedNodes().length == 0) return;

            var param = {};
            if ($this.children("input").val() != '') param.sSearch = $this.children("input").val();
            if ($this.ztree.getSelectedNodes().length > 0) param.id = $this.ztree.getSelectedNodes()[0].id;

            jQuery.ajax({
                type: "get",
                async: false,
                url: options.basePath + '/sys/operator/getOperators.html',
                data: param,
                dataType: "json",
                success: function (data) {
                    for (var i in data) {
                        $this.children('.nav').append('<li class="navli" dataid="' + data[i].id
                            + '" datausercode="' + data[i].usercode
                            + '" datausername="' + data[i].username + '">' + data[i].username + '</li>');
                    }
                }
            });
        };

        $this.children("input").change(getData);
        $this.children("span").click(getData);

        $this.children('.nav').on("click", "li", function () {
            options.onClick($(this).attr("dataid"), $(this).attr("datausercode"), $(this).attr("datausername"));
        });

        $this.ztree = $.fn.zTree.init($this.children('.ztree'), {
            async: {url: options.basePath + '/sys/organization/list.html', enable: true, type: 'get'},
            view: {selectedMulti: false, showIcon: false},
            data: {
                simpleData: {enable: true, idKey: "id", pIdKey: "parentid"},
                key: {name: "orgname"}
            },
            callback: {
                onClick: function (event, treeId, treeNode, clickFlag) {
                    if (treeNode.id == selectedDataId) {
                        selectedDataId = null;
                        $this.ztree.cancelSelectedNode();
                    } else {
                        selectedDataId = treeNode.id;
                    }
                    getData();
                },
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    $this.ztree.expandNode($this.ztree.getNodeByTId(treeId + "_1"));
                }
            }
        }, null);

        return $this;
    };

})(jQuery);

jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入一个长度最多是{0}的字符串"),
    minlength: jQuery.validator.format("请输入一个长度最少是{0}的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于{0}和{1}之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0}和 {1}之间的值"),
    max: jQuery.validator.format("请输入一个最大为{0}的值"),
    min: jQuery.validator.format("请输入一个最小为{0}的值")
});

var toastr;
var bootbox;

$(document).ready(function () {

    $.fn.chosen = function (option) {
        return $(this).select2(option);
    }

    toastr = {
        success: function (msg, fn) {
            var content = $("<div>" + msg + "</div>")[0];
            swal({
                content: content,
                icon: "success"
            }).then(function (value) {
                if (fn)
                    fn(1);
            });
        },
        error: function (msg) {
            var content = $("<div>" + msg + "</div>")[0];
            swal({
                content: content,
                icon: "error"
            });
        },
        info: function (msg) {
            var content = $("<div>" + msg + "</div>")[0];
            swal({
                content: content,
                icon: ""
            });
        },
        warning: function (msg) {
            var content = $("<div>" + msg + "</div>")[0];
            swal({
                content: content,
                icon: "warning"
            });
        }
    };

    bootbox = {
        confirm: function (msg, fu) {
            var content = $(msg)[0];
            if (!content) {
                content = $("<div>" + msg + "</div>")[0];
            }
            advanceSwal({
                content: content,
                dangerMode: true,
                icon: "warning",
                buttons: {
                    cancel: {
                        text: "取消",
                        value: 0,
                        visible: true,
                        className: "",
                        closeModal: true,
                    },
                    confirm: {
                        text: "确定",
                        value: 1,
                        visible: true,
                        className: "",
                        closeModal: false
                    }
                }
            }, fu);
        }
    };


    $('.chosen-select').chosen({
        no_results_text: "未找到此选项!",
        width: "200px"
    });

    //将* 移到label的前面
    $(".star").each(function () {
        $(this).prependTo($(this).parent());
    });

    $("a[data-rel=tooltip]").tooltip();

    Highcharts.setOptions({
        global: {
            timezoneOffset: -8 * 60
        },
        lang: {
            contextButtonTitle: "导出",
            decimalPoint: ".",
            downloadJPEG: "导出 JPEG",
            downloadPDF: "导出 PDF",
            downloadPNG: "导出 PNG",
            downloadSVG: "导出 SVG",
            drillUpText: "上钻",
            invalidDate: "无效的时间",
            loading: "加载中",
            months: "月份",
            noData: "没有数据",
            numericSymbolMagnitude: "国际单位符基数",
            numericSymbols: "国际单位符",
            printChart: "打印图表",
            resetZoom: "重置缩放比例",
            thousandsSep: ","
        }
    });

    /**
     * 关闭浏览器的记忆输入功能
     */
    $("form").attr("autocomplete", "off");

    //Ajax全局配置
    $.ajaxSetup({
        beforeSend: function () {
            // Handle the beforeSend event
            // showWiatModal();
        },
        //type: "POST", //用 POST 代替默认 GET 方法
        cache: false, //禁止AJAX缓存，开发模式下设置为false
        timeout: 60000, //请求超市时间（1分钟）
        statusCode: {
            404: function () {
                alert('页面不存在');
            },
            500: function () {
                alert('服务器内部错误');
            },
            405: function () {
                alert('没有权限');
            },
            301: function (data, textStatus) { // session超时，或者用户未登录，跳转到登录页面

                alert("登录超时，请重新登录！");
                window.location.href = getRootPath() + '/index.html';
                /*setTimeout(function () {
                 window.location.href = bashPath + '/index';
                 }, 2000);*/
            }
        },
        complete: function () {
            // debugger;
            // swal.close();
        }
    });

    //TextArea提示信息
    $('textarea.limited').inputlimiter({
        remText: '剩余 %n 个字允许输入...',
        limitText: '最大允许输入字数 : %n.'
    });


});


/**
 * 获取 当前日期的 str ------ 用来存放 upload file 的相对目录
 * @returns {string}
 */
function getDateStr() {
    var myDate = new Date();
    /*myDate.getYear();        //获取当前年份(2位)
     myDate.getFullYear();    //获取完整的年份(4位,1970-????)
     myDate.getMonth();       //获取当前月份(0-11,0代表1月)
     myDate.getDate();        //获取当前日(1-31)
     myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
     myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
     myDate.getHours();       //获取当前小时数(0-23)
     myDate.getMinutes();     //获取当前分钟数(0-59)
     myDate.getSeconds();     //获取当前秒数(0-59)
     myDate.getMilliseconds();    //获取当前毫秒数(0-999)
     myDate.toLocaleDateString();     //获取当前日期
     var mytime=myDate.toLocaleTimeString();     //获取当前时间
     myDate.toLocaleString( );        //获取日期与时间*/
    return myDate.getFullYear() + '' + pad((myDate.getMonth() + 1), 2) + myDate.getDate();
}


/**
 * eg
 *  initCommonWebSocket("/socket/macUpLog", function (data) {
 *      // do something
 *    });
 * @param path websocket路径
 * @param callback 接收信息回调
 * @return 返回 连接对象信息
 */
function initCommonWebSocket(path, callback) {
    var sock = new SockJS(getRootPath() + path);
    sock.onopen = function () {
        console.log('open websocket ' + path);
    };
    sock.onmessage = function (e) {
        callback(e.data);
    };
    sock.onclose = function () {
        console.log('close websocket ' + path);
    };
    return sock;
}


/**
 * 获得项目路径
 * @returns {*}
 */
function getRootPath() {
    var strFullPath = window.document.location.href;
    var preFix;
    if (strFullPath.indexOf("http://") > -1) {
        preFix = "http://";
    } else {
        preFix = "https://";
    }
    strFullPath = strFullPath.replace(preFix, "");
    var baseUrl = $("#basePath").val();
    var applicationPath = baseUrl.substring(0, baseUrl.length - 1);
    var strMain = strFullPath.substring(0, strFullPath.indexOf("/"));
    return preFix + strMain + applicationPath;
    // var strFullPath = window.document.location.href;
    // var strPath = window.document.location.pathname;
    // var pos = strFullPath.indexOf(strPath);
    // var prePath = strFullPath.substring(0, pos);
    // var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    // return (prePath + postPath);
}

/**
 * 后台list传前台，转查询框数据格式
 * @param arr
 * @param idVal
 * @param nameVal
 * @returns {*}
 */
function generateSource(arr, idVal, nameVal) {
    var source = [];
    $.each(arr, function (index, item) {
        source.push({
            id: item[idVal] ? item[idVal] : "",
            value: item[idVal] ? item[idVal] : "",
            name: item[nameVal] ? item[nameVal] : "",
            text: item[nameVal] ? item[nameVal] : ""
        });
    });
    return source;
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

function formatAmount(amount) {
    if (!amount || amount == 0 || isNaN(amount)) {
        return 0;
    }
    return (amount / 100).toFixed(2);
}

/**
 * 补0
 * @param num
 * @param n
 * @returns {*}
 */
function pad(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
}


/**
 * jquery gritter
 * 使用前 先引入 js
 *
 <script th:src="@{/js/jquery.gritter.min.js}"></script>
 ***/


/**
 * 应用场景： 完成   一个操作提交之后，不允许流在该页面，但又需要提示用户
 * 提示操作成功，并 多少秒内跳转
 */
function myFinishAndTurnFn(title, message, fn) {
    var close_Interval;
    var messageHtml = '<div class="modal-header">' +
        '<h4 class="modal-title green">' + title + '</h4>' +
        '</div> ' +
        '<div class="modal-body"> ' +
        '<div class="bootbox-body"> ' +
        message + ' <span class="red2" id="close_countdown">5</span> 秒后跳转...' +
        '</div>' +
        '</div>';
    bootbox.dialog({
        message: messageHtml,
        buttons: {
            "success": {
                "label": "<i class='ace-icon fa fa-check'></i> 马上跳转",
                "className": "btn-sm btn-success",
                "callback": function () {
                    // console.log('马上跳转');
                    clearInterval(close_Interval);
                    fn();
                }
            }
        }
    });
    $(".bootbox-close-button").remove();   // 移除 弹出框的 关闭按钮，
    close_Interval = setInterval(function () {
        var cur = $("#close_countdown").html();
        var next = parseInt(cur) - 1;

        $("#close_countdown").html(next);
        if (next == 0) {
            //console.log('自动跳转');
            clearInterval(close_Interval);
            fn();
        }
    }, 1000);
}

function table(target, datatable, sublength) {
    var index = $(datatable.api().context[0].nTable).find("tr").index($(target).closest('tr')) - 1;
    var cols = datatable.fnSettings().aoColumns;
    var trs = '';
    for (var i = 0; i < cols.length - sublength; i++) {
        if (!$(datatable.fnSettings().aoData[index].anCells[i]).hasClass("hidden"))
            trs += '<tr>' +
                '<td>' + cols[i].sTitle + ':' + '</td> ' +
                '<td>' + $(datatable.fnSettings().aoData[index].anCells[i]).text() + '</td>' +
                '</tr>';
    }
    return $('<table class="table" width="100%"/>').append(trs);
}

/**
 * modal 显示行内元素
 * @param target  点击行元素
 * @param datatable  datatable对象
 * @param sublength  从右向左列截取长度
 */
function modalDatatable(target, datatable, sublength) {

    var modal = $('<div class="modal fade"/>')
        .append($('<div class="modal-dialog"/>')
            .append($('<div class="modal-content detailModelHead"/>')
                .append($('<div class="modal-body" style="padding: 0px"/>')
                    .append(table(target, datatable, sublength)))))
        .appendTo('body');


    var close = function () {
        bodymodalclose();
        modal.remove(); // will tidy events for us
        $(document).off('keypress.dtr');
    };

    $('div.detailModelHead').prepend($('<div class="modal-header">详情 </div>').append($('<div style="float: right;cursor: pointer;">&times;</div>')
        .click(function () {
            close();
        })
    ));
    modal.modal({'backdrop': 'static'});
}


function initTableSerach(datatable, callback) {
    //表单条件查询 初始化
    var toolTipFormats = [];
    var formStr = "";
    for (var i = 0; i < datatable.context[0].aoColumns.length; i++) {
        var column = datatable.context[0].aoColumns[i];
        if (column.iscondition) {
            if (!column.conditiontype || column.conditiontype == "input") {
                formStr += '<div class="" style="margin-top: 3px;float: left;min-height: 40px;">\
                        <div class="text-left">\
                        <button type="button" disabled="disabled" style="color: black" class="btn btn-white btn-sm">\
                        ' + column.sTitle + '\
                        </button>\
                         </div>\
                        <div class="">\
                        <input type="text" autocomplete="off" class="form-control"  name="' + column.conditionName + '">\
                        </div>\
                    </div>';
            } else if (column.conditiontype == "select") {
                formStr += '<div class="" style="margin-top: 3px;float: left;min-height: 40px;">\
                        <div class="text-left">\
                        <button type="button" disabled="disabled" style="color: black" class="btn btn-white btn-sm">\
                        ' + column.sTitle + '\
                        </button>\
                         </div>\
                        <div class=""><select class="chosen-select" name="' + column.conditionName + '"><option value="">请选择</option>';
                var source = column.conditionsource;
                for (var ii = 0; ii < source.length; ii++) {
                    formStr += '<option value="' + source[ii].id + '">' + source[ii].name + '</option>';
                }
                formStr += '</select></div></div>';
            } else if (column.conditiontype == "date") {
                formStr += ' <div style="margin-top: 3px;;min-height: 40px;">\n' +
                    '                        <div class=" " style="float: left">\n' +
                    '                            <button type="button" disabled="disabled" style="color: black" class="btn btn-white btn-sm">\n' +
                    '                                ' + column.sTitle + '：\n' +
                    '                            </button>\n' +
                    '                        </div>\n' +
                    '                        ' +
                    '                            \n' +
                    '                                <div  style="float: left" class="input-daterange input-group data-picker" >\n<div>' +
                    '                                    <input type="text" class="input-sm form-control" name="start_' + column.conditionName + '" value=""\n' +
                    '                                          >\n' +
                    '                                   </div><div> <span class="input-group-addon">到</span>\n</div><div>' +
                    '                                    <input type="text" class="input-sm form-control" name="end_' + column.conditionName + '" value="" >\n' +
                    '                                </div></div>\n' +
                    '                            \n' +
                    '                        \n' +
                    '                    </div>';

            } else if (column.conditiontype == "step") {
                /**
                 * 参考：
                 * http://www.htmleaf.com/jQuery/Form/201502041324.html
                 * @type {string}
                 */
                toolTipFormats.push(column.stepConfig.formatter);

                formStr += '<div class="" style="margin-top: 3px;float: left;min-height: 40px;">\
                        <div class="text-left">\
                        <button type="button" disabled="disabled" style="color: black" class="btn btn-white btn-sm">\
                        ' + column.sTitle + '\
                        </button>\
                         </div>\
                        <div class="">\
                         <input type="text" autocomplete="off" class="form-control step"  data-slider-min="' + column.stepConfig.min + '" data-slider-max="' + column.stepConfig.max + '"  ' +
                    'data-slider-step="' + column.stepConfig.step + '" data-slider-value="' + column.stepConfig.default + '"   data-slider-tooltip="' + column.stepConfig.tooltip + '"  ' +
                    'name="' + column.conditionName + '">\
                        </div>\
                    </div>';
            } else {
                console.log("unknow type:" + column.conditiontype);
            }
        }
    }
    var allStr = '<form id="searchTable" class="collapse searchTable" autocomplete="off"><div class="row">  ' + formStr + ' <div class=""><div style="float: left;line-height: 40px;margin-left: 10px"><button class="btn btn-primary btn-sm" id="btnselect"><i class="fa fa-search"></i>查询</button></div></div></div></form>';
    if ($("#" + datatable.context[0].sTableId).closest(".widget-main").length > 0) {
        $("#" + datatable.context[0].sTableId).closest(".widget-main").before(allStr);
    } else {
        $("#" + datatable.context[0].sTableId).before(allStr);
    }

    $("#btnselect").bind("click", function (e) {
        e.preventDefault();
        getdata();
    })

    $('#searchTable select').chosen({
        no_results_text: "未找到此选项!",
        width: "152px"
    });

    $("#searchTable .data-picker").datepicker({
        clearBtn: true,
        endDate: "0d",
        language: "zh-CN",
        format: 'yyyy-mm-dd'
    });

    $("#searchTable .step").each(function (i, n) {
        $(n).slider({
            formatter: toolTipFormats[i]
        });
    });


    //将参数设置函数 添加到datatable
    var oldfn = datatable.context[0].aoServerParams[0].fn;
    datatable.context[0].aoServerParams[0].fn = function (aoData) {
        oldfn(aoData);
        var $area = $("#searchTable");
        if ($area.length > 0) {
            $("#searchTable input[type=text],#searchTable select").each(function (i, n) {
                if ($(n).val())
                    aoData.push({name: $(n).attr("name"), value: $.trim($(n).val())});
                // }
            });
        }
        // for (var t = 0; t < aoData.length; t++) {
        //     var item = aoData[t];
        //     //console.log(typeof item.value);
        //     if (item.value && typeof item.value == "string") {
        //         item.value = (item.value).replace(/%/g, "###");
        //     }
        // }
    }
    var oldCallBackfn = datatable.context[0].aoDrawCallback[0].fn;
    datatable.context[0].aoDrawCallback[0].fn = function (aoData) {
        $("#" + datatable.context[0].sTableId).DataTable().responsive.recalc();
        //recalc方法会重置掉callback中一些点击事件和方法，这里先调用recalc再执行callback
        oldCallBackfn(aoData);
    }

    if (callback) {
        callback();
    }

}

/**
 * 网点 机器 联动js
 *
 * @param orgId  网点id
 * @param $macSelect 机器选择的jquery对象
 */
function commonOrgToMachine($orgSelect, $macSelect) {
    $orgSelect.bind("change", function () {
        $macSelect.html("<option value=''>请选择机器</option>");
        $.post(getRootPath() + "/common/selectMachineByOrg", {orgId: $orgSelect.val()}, function (data) {
            for (var i = 0; i < data.length; i++) {
                $macSelect.append("<option value='" + data[i].machineId + "'>" + data[i].machineName + "</option>");
            }
        });
        $macSelect.trigger("change");
    });
}


/**
 * 网点 班级 联动js
 *
 * @param orgId  网点id
 * @param $classSelect 班级选择的jquery对象
 */
function commonOrgToClass($orgSelect, $classSelect) {
    $orgSelect.bind("change", function () {
        $classSelect.html("<option value=''>请选择班级</option>");
        $.post(getRootPath() + "/common/getClassByOrg", {orgId: $orgSelect.val()}, function (data) {
            for (var i = 0; i < data.length; i++) {
                $classSelect.append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
            }
        });
        $classSelect.trigger("change");
    });
}

function showWiatModal(message) {
    if (!message) {
        message = "正在处理，请稍后....";
    }
    var content = $("<div>" + message + "</div>")[0];
    swal({
        icon: 'warning',
        content: content,
        button: {text: "......", closeModal: false},
        closeOnEsc: false,
        closeOnClickOutside: false
    });
    $(".swal-button-container button").addClass("swal-button swal-button--confirm swal-button--loading");
}


function advanceSwal(option, callback) {
    var defaultOption = {
        text: "",
        title: "",
        icon: "",
        buttons: "",
        content: "",
        closeOnClickOutside: false,
        dangerMode: false,
        timer: null
    };
    var targetOption = $.extend({}, defaultOption, option);
    swal(targetOption).then(function (value) {
        if (value) callback(1); else swal.close();
    });
}

/**
 * @param callback
 * callback(consume) =====选择的cansume对象
 * defaultOrg --默认选择的机构
 */
function selectOrgConsume(callback, defaultOrg) {

    var modal = $('<div class="modal fade"/>')
        .append($('<div class="modal-dialog modal-lg" style=""/>')
            .append($('<div class="modal-content detailModelHead" />')
                .append(
                    $('<div class="modal-body selectOrgConsume" style="height: 450px;overflow: auto"/>')
                        .append('<select class="form-control selectOrgConsume_org" style="width: 200px;display: inline-block;margin-bottom: 5px"/><input class="form-control selectOrgConsume_consumeName" placeholder="请输入姓名，回车键开始检索" style="width: 300px;display: inline-block;margin-left: 10px"/>')
                        .append('<table class="table table-bordered selectOrgConsume_table"><thead><tr><th>网点</th><th>年级</th><th>班级</th><th>姓名</th><th>选择</th></tr></thead><tbody></tbody></table>')
                )
            )
        )
        .appendTo('body');

    var close = function () {
        bodymodalclose();
        modal.remove(); // will tidy events for us
        $(document).off('keypress.dtr');
    };

    $('div.detailModelHead').prepend($('<div class="modal-header">选择会员 </div>').append($('<div style="float: right;cursor: pointer;">&times;</div>')
        .click(function () {
            close();
        })
    ));

    $("input.selectOrgConsume_consumeName").enterListen(function () {
        var orgId = $(".selectOrgConsume_org").val();
        var consumeName = $("input.selectOrgConsume_consumeName").val();
        if (!orgId) {
            toastr.info("请选择网点进行查询");
            return;
        }
        $(".selectOrgConsume_table tbody").html("<tr><td colspan='6'>正在请求，请稍候....</td></tr>");
        $.ajax({
            url: getRootPath() + "/common/getConsumesByOrgAndName",
            type: "POST",
            data: {
                orgId: orgId,
                consumeName: consumeName
            },
            success: function (data) {
                $(".selectOrgConsume_table tbody").empty();
                for (var i in data) {
                    var consume = data[i];
                    var $tr = $("<tr><td>" + consume.orgName + "</td><td>" + (consume.gradeName ? consume.gradeName : "") + "</td><td>" + (consume.className ? consume.className : "") + "</td><td>" + consume.name + "</td><th><button class='btn btn-primary btn-xs'><i class='fa fa-check'>&nbsp;&nbsp;选择</i></button></th>");
                    $(".selectOrgConsume_table tbody").append($tr);
                    $tr.find("button").data("data", consume);
                    $tr.find("button").bind("click", function (e) {
                        e.preventDefault();
                        callback($(this).data("data"));
                        close();
                    });
                }
            }
        });
    });

    $.ajax({
        url: getRootPath() + "/common/getUserOrgs",
        type: 'GET',
        dataType: "json",
        success: function (data) {
            $('.selectOrgConsume_org').html("<option value=''>请选择网点</option>");
            for (var i in data) {
                if (data[i].id == defaultOrg) {
                    $('.selectOrgConsume_org').append("<option value='" + data[i].id + "' selected>" + data[i].orgName + "</option>")
                } else {
                    $('.selectOrgConsume_org').append("<option value='" + data[i].id + "'>" + data[i].orgName + "</option>")
                }

            }
            $('.selectOrgConsume_org').chosen({
                no_results_text: "未找到此选项!",
                width: "200px"
            });
        }
    })


    modal.modal({'backdrop': 'static'});
}


function queryWxInfo(target, type) {
    var data = datatable.fnGetData($(target).closest('tr'));

    $.post(getRootPath() + "/common/queryWxUserInfo", {recordid: data.id}, function (datas) {
        var modal = $('<div class="wxInfoModal modal fade"/>')
            .append($('<div class="modal-dialog modal-lg" style=""/>')
                .append($('<div class="modal-content detailModelHead" />')
                    .append(
                        $('<div class="modal-body " style="height: 450px;overflow: auto"/>')
                            .append('<table class="table table-bordered wxUserInfotable"><thead><tr><th>头像</th><th>昵称</th><th>国家</th><th>省份</th><th>城市</th><th>性别</th><th></th></tr></thead><tbody></tbody></table>')
                    )
                )
            )
            .appendTo('body');

        var close = function () {
            bodymodalclose();
            modal.remove(); // will tidy events for us
            $(document).off('keypress.dtr');
        };

        $('div.detailModelHead').prepend($('<div class="modal-header">微信用户信息 </div>').append($('<div style="float: right;cursor: pointer;">&times;</div>')
            .click(function () {
                close();
            })
        ));

        var removeWxBind = function (openid, recordid, type) {
            $.post(getRootPath() + "/common/removeWxBind", {
                openid: openid, recordid: recordid, type: type
            }, function (data) {
                toastr.success("解绑成功");
                bodymodalclose();
                modal.remove();
                queryWxInfo(target, type);
            });
        }


        for (var i in datas) {
            var $button = $("<button class='btn btn-primary btn-xs'>解除绑定关系</button>");

            $button.bind("click", function () {
                removeWxBind(datas[i].openid, data.id, type);
            })

            var $tr = $("<tr>" +
                "<td><img width='50' height='50' src='" + datas[i].headimgurl + "'></td>" +
                "<td>" + datas[i].nickname + "</td>" +
                "<td>" + datas[i].country + "</td>" +
                "<td>" + datas[i].province + "</td>" +
                "<td>" + datas[i].city + "</td>" +
                "<td>" + (datas[i].sex == 1 ? "男" : (datas[i].sex == 0 ? "未知" : "女")) + "</td>" +
                "<td></td>" +
                "</tr>");

            $tr.find("td:last").append($button);

            $('table.wxUserInfotable tbody').append($tr);
        }

        modal.modal({'backdrop': 'static'});
    });
}

function bodymodalclose() {
    $("body").removeClass("modal-open");
    $("body").css("padding-right","0px");
}


