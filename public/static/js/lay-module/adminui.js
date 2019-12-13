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
            
        }

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
            if (isIframe == undefined || isIframe == false) {
                $(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            } else {
                parent.layui.$(".layui-tab-title li").each(function () {
                    checkTabId = $(this).attr('lay-id');
                    if (checkTabId != null && checkTabId == tabId) {
                        checkTab = true;
                    }
                });
            }
            if (checkTab == false) {
                return false;
            }

            // 判断sessionStorage是否有
            var tabInfo = JSON.parse(sessionStorage.getItem("tabInfo"));
            if (tabInfo == null) {
                tabInfo = {};
            }
            var check = tabInfo[tabId];
            if (check == undefined || check == null) {
                return false;
            }
            return true;
        };


        /**
         * 打开选项卡
         * @param tabId
         * @param href
         * @param title
         * @param addSession
         */
        this.addTab = function (tabId, href, title, addSession) {
            if (addSession == undefined || addSession == true) {
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

        if (target == '_blank') {  // 表示打开新窗口
            layer.close(loading);
            window.open(href, "_blank");
            return false;
        }

        // 拼接链接参数（暂无）
        // 判断链接有效（暂无）
        // 判断tabId
        if (tabId == null || tabId == undefined) {
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

    exports("adminui", adminui);
});