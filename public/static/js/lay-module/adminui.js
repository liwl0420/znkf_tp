/**
 * date:20191213
 * author:WL
 * description:后台界面框架
 */

layui.define(["element", "jquery"], function (exports) {
    var $ = layui.$
        ,element = layui.element
        ,layer = layui.layer;

    let adminui = new function () {

        this.init = function () {

        };

        /**
         *
         * 判断窗口是否已打开
         * @param tabId
         * @param isIframe 是否从子界面的iframe判断
         * @returns {boolean}
         */
        this.checkTab = function (tabId, isIframe) {
            // 判断选项卡上是否有
            var checkTab = false;
            if (isIframe === undefined || isIframe === false) {
                $(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId === tabId) {
                        checkTab = true;
                    }
                });
            }
            if (checkTab === false) {
                return false;
            }

            // 判断sessionStorage是否有
            var tabInfo = JSON.parse(sessionStorage.getItem("tabInfo"));
            if (tabInfo == null) {
                tabInfo = {};
            }
            var check = tabInfo[tabId];
            return check !== undefined;

        };


        /**
         * 打开选项卡
         * @param tabId
         * @param href
         * @param title
         * @param addSession
         */
        this.addTab = function (tabId, href, title, addSession) {
            if (addSession === undefined || addSession === true) {
                var tabInfo = JSON.parse(sessionStorage.getItem("tabInfo"));
                if (tabInfo == null) {
                    tabInfo = {};
                }
                tabInfo[tabId] = {href: href, title: title};
                sessionStorage.setItem("tabInfo", JSON.stringify(tabInfo));
            }
            element.tabAdd('adminTab', {
                title: title
                , content: '<iframe width="100%" height="100%" frameborder="0"  src="' + href + '"></iframe>'
                , id: tabId
            });
        };

        /**
         * 刷新当新选项卡
         */
        this.refreshTab = function () {
            var othis = parent.layui.$(".layui-tab-title li.layui-this").eq(0)
                , layId = othis.attr('lay-id')
                , index = othis.parents().children('li').index(othis)
                , parents = othis.parents('.layui-tab').eq(0)
                , item = parents.children('.layui-tab-content').children('.layui-tab-item')
                , oiframe = item.eq(index).find('iframe')
                , src = item.eq(index).find('iframe').attr('src');
            oiframe.attr('src', src);
        };

        /**
         * 关闭选项卡
         * @param isAll 是否关闭全部
         */
        this.closeTab = function (isAll = false) {
            $(".layui-tab-title li").each(function () {
                tabId = $(this).attr('lay-id');
                var id = $(this).attr('id');
                if (id !== 'homeTabLi') {
                    var tabClass = $(this).attr('class');
                    if (isAll || tabClass !== 'layui-this') {
                        var tabInfo = JSON.parse(sessionStorage.getItem("tabInfo"));
                        if (tabInfo != null) {
                            delete tabInfo[tabId];
                            sessionStorage.setItem("tabInfo", JSON.stringify(tabInfo))
                        }
                        element.tabDelete('adminTab', tabId);
                    }
                }
            });
        }
    };

    /**
     * 打开新选项卡
     */
    $('body').on('click', '[data-tab]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});  // 加载

        var tabId = $(this).attr('data-tab'),
            href = $(this).attr('data-tab'),
            title = $(this).html(),
            target = $(this).attr('target');

        if (target === '_blank') {  // 表示打开新窗口
            layer.close(loading);
            window.open(href, "_blank");
            return false;
        }

        // 拼接链接参数（暂无）
        // 判断链接有效（暂无）
        // 判断tabId
        if (tabId === undefined) {
            tabId = new Date().getTime();
        }
        // 判断选项卡是否已打开
        var checkTab = adminui.checkTab(tabId);
        if (!checkTab) {
            adminui.addTab(tabId, href, title, true);
        }
        element.tabChange('adminTab', tabId);
        layer.close(loading);
    });

    /**
     * 选项卡操作，刷新当前选项卡/关闭其他选项卡
     */
    $('body').on('click', '[data-tab-operation]', function () {
        var loading = layer.load(0, {shade: false, time: 2 * 1000});  // 加载
        opId = $(this).attr('data-tab-operation');
        if (opId === 'refresh') {
            adminui.refreshTab();
        } else if (opId === 'closeOther') {
            adminui.closeTab();
        } else if (opId === 'closeAll') {
            adminui.closeTab(true);
        }
        $(this).parent().removeClass('layui-this'); // 去除焦点
        layer.close(loading);
    });

    exports("adminui", adminui);
});