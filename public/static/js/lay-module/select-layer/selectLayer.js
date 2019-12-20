layui.define(['table', 'jquery', 'form', 'layer'], function (exports) {
    "use strict";

    var $ = layui.jquery
        , layer = layui.layer
        , table = layui.table
        , form = layui.form;

    var selectLayer = {
        render: function (opt) {
            var elem = $(opt.elem)
                , title = opt.title || '请选择'           // 弹出框标题
                , id = opt.id || ''                       // 弹出框ID
                , area = opt.area || ['600px', '500px']   // 弹出框大小
                , checkedKey = opt.checkedKey             // 表格数据的主键值，非常重要，影响到选中状态 必填
                , searchKey = opt.searchKey || 'keyword'	            // 搜索输入框的name值 默认keyword
                , searchPlaceholder = opt.searchPlaceholder || '搜索'	// 搜索输入框的提示文字 默认搜索
                , tableDone = opt.table.done || function () {
            };           // 表格渲染完成的操作

            var tableName = "tableSelect_table_" + new Date().getTime();
            var tableBox = '<div class="tableSelect layui-anim layui-anim-upbit" style="border: 1px solid #d2d2d2;background-color: #fff;box-shadow: 0 2px 4px rgba(0,0,0,.12);padding:10px 10px 0 10px;z-index:66666666;margin: 5px 0;border-radius: 2px;min-width:530px;">';
            tableBox += '<div class="tableSelectBar">';
            tableBox += '<form class="layui-form" action="" style="display:inline-block;">';
            tableBox += '<input style="display:inline-block;width:190px;height:30px;vertical-align:middle;margin-right:-1px;border: 1px solid #C9C9C9;" type="text" name="' + opt.searchKey + '" placeholder="' + opt.searchPlaceholder + '" autocomplete="off" class="layui-input">';
            tableBox += '<button class="layui-btn layui-btn-sm layui-btn-primary tableSelect_btn_search" lay-submit lay-filter="tableSelect_btn_search"><i class="layui-icon layui-icon-search"></i></button>';
            tableBox += '</form>';
            tableBox += '<button style="float: right;margin-left: 10px" class="layui-btn layui-btn-primary layui-btn-sm tableSelect_btn_reset">重置</button>';
            tableBox += '<button style="float: right" class="layui-btn layui-btn-sm tableSelect_btn_select">确定<span></span></button>';
            tableBox += '</div>';
            tableBox += '<table id="' + tableName + '" lay-filter="' + tableName + '"></table>';
            tableBox += '</div>';

            //数据缓存
            var checkedData = [];

            var layerIndex = layer.open({
                'type': 1
                , 'title': title
                , 'content': tableBox
                , 'id': id
                , 'resize': false
                , 'area': area
                , 'success': function (index, layero) {
                }
                , 'end': function () {
                    opt.done(elem, null);
                }
            });
            //渲染TABLE
            opt.table.elem = "#" + tableName;
            opt.table.id = tableName;
            opt.table.done = function (res, curr, count) {
                defaultChecked(res, curr, count);
                setChecked(res, curr, count);
                tableDone(res, curr, count);
            };
            var tableSelect_table = table.render(opt.table);

            var tableBoxObj = $('#' + id);

            table.on('radio(' + tableName + ')', function (obj) {
                if (checkedKey) {
                    checkedData = table.checkStatus(tableName).data
                }
                updataButton(table.checkStatus(tableName).data.length)
            });
            table.on('checkbox(' + tableName + ')', function (obj) {
                if (checkedKey) {
                    if (obj.checked) {
                        for (var i = 0; i < table.checkStatus(tableName).data.length; i++) {
                            checkedData.push(table.checkStatus(tableName).data[i])
                        }
                    } else {
                        if (obj.type === 'all') {
                            for (var j = 0; j < table.cache[tableName].length; j++) {
                                for (var i = 0; i < checkedData.length; i++) {
                                    if (checkedData[i][checkedKey] === table.cache[tableName][j][checkedKey]) {
                                        checkedData.splice(i, 1)
                                    }
                                }
                            }
                        } else {
                            //因为LAYUI问题，操作到变化全选状态时获取到的obj为空，这里用函数获取未选中的项。
                            function nu() {
                                var noCheckedKey = '';
                                for (var i = 0; i < table.cache[tableName].length; i++) {
                                    if (!table.cache[tableName][i].LAY_CHECKED) {
                                        noCheckedKey = table.cache[tableName][i][checkedKey];
                                    }
                                }
                                return noCheckedKey
                            }

                            var noCheckedKey = obj.data[checkedKey] || nu();
                            for (var i = 0; i < checkedData.length; i++) {
                                if (checkedData[i][checkedKey] === noCheckedKey) {
                                    checkedData.splice(i, 1);
                                }
                            }
                        }
                    }
                    checkedData = uniqueObjArray(checkedData, checkedKey);
                    updataButton(checkedData.length)
                } else {
                    updataButton(table.checkStatus(tableName).data.length)
                }
            });

            //按钮选中
            tableBoxObj.find(' .tableSelect_btn_select').eq(0).on('click', function () {
                var checkStatus = table.checkStatus(tableName);
                if (checkedData.length > 1) {
                    checkStatus.data = checkedData;
                }
                selectDone(checkStatus);
            });
            //按钮重置
            tableBoxObj.find(' .tableSelect_btn_reset').eq(0).on('click', function () {
                for (var i = 0; i < table.cache[tableName].length; i++) {
                    for (var j = 0; j < checkedData.length; j++) {
                        if (table.cache[tableName][i][checkedKey] === checkedData[j][checkedKey]) {
                            table.cache[tableName][i].LAY_CHECKED = false;
                            var index = table.cache[tableName][i]['LAY_TABLE_INDEX'];
                            var checkbox = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="checkbox"]');
                            checkbox.prop('checked', false).next().removeClass('layui-form-checked');
                            var radio = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="radio"]');
                            radio.prop('checked', false).next().removeClass('layui-form-radioed').find("i").html('&#xe63f;');
                        }
                    }
                }
                checkedData = [];
                var checkStatus = table.checkStatus(tableName);
                if (!checkStatus.isAll) {
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', false);
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().removeClass('layui-form-checked');
                }
                updataButton(checkedData.length);
            });

            //关键词搜索
            form.on('submit(tableSelect_btn_search)', function (data) {
                tableSelect_table.reload({
                    where: data.field,
                    page: {
                        curr: 1
                    }
                });
                return false;
            });

            //写值回调和关闭
            function selectDone(checkStatus) {
                if (checkedKey) {
                    var selected = [];
                    for (var i = 0; i < checkStatus.data.length; i++) {
                        selected.push(checkStatus.data[i][checkedKey])
                    }
                    elem.attr("ts-selected", selected.join(","));
                }
                opt.done(elem, checkStatus);
                tableBoxObj.remove();
                layer.close(layerIndex);
                delete table.cache[tableName];
                checkedData = [];
            }

            //渲染表格后选中
            function setChecked(res, curr, count) {
                for (var i = 0; i < res.data.length; i++) {
                    for (var j = 0; j < checkedData.length; j++) {
                        if (res.data[i][checkedKey] === checkedData[j][checkedKey]) {
                            res.data[i].LAY_CHECKED = true;
                            var index = res.data[i]['LAY_TABLE_INDEX'];
                            var checkbox = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="checkbox"]');
                            checkbox.prop('checked', true).next().addClass('layui-form-checked');
                            var radio = $('#' + tableName + '').next().find('tr[data-index=' + index + '] input[type="radio"]');
                            radio.prop('checked', true).next().addClass('layui-form-radioed').find("i").html('&#xe643;');
                        }
                    }
                }
                var checkStatus = table.checkStatus(tableName);
                if (checkStatus.isAll) {
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                    $('#' + tableName + '').next().find('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                }
                updataButton(checkedData.length)
            }

            //写入默认选中值(puash checkedData)
            function defaultChecked(res, curr, count) {
                if (checkedKey && elem.attr('ts-selected')) {
                    var selected = elem.attr('ts-selected').split(",");
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < selected.length; j++) {
                            if (res.data[i][checkedKey] === selected[j]) {
                                checkedData.push(res.data[i])
                            }
                        }
                    }
                    checkedData = uniqueObjArray(checkedData, checkedKey);
                }
            }

            //更新选中数量
            function updataButton(n) {
                tableBoxObj.find('.tableSelect_btn_select span').eq(0).html(n === 0 ? '' : '(' + n + ')')
            }

            //数组去重
            function uniqueObjArray(arr, type) {
                var newArr = [];
                var tArr = [];
                if (arr.length === 0) {
                    return arr;
                } else {
                    if (type) {
                        for (var i = 0; i < arr.length; i++) {
                            if (!tArr[arr[i][type]]) {
                                newArr.push(arr[i]);
                                tArr[arr[i][type]] = true;
                            }
                        }
                        return newArr;
                    } else {
                        for (var i = 0; i < arr.length; i++) {
                            if (!tArr[arr[i]]) {
                                newArr.push(arr[i]);
                                tArr[arr[i]] = true;
                            }
                        }
                        return newArr;
                    }
                }
            }
        }
    };

    exports("selectLayer", selectLayer);
});