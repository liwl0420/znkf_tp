<?php /*a:1:{s:76:"E:\ENV\AppServ\www\znkf_tp\application\resources\views\admin\login_view.html";i:1576131290;}*/ ?>
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>知识库管理 - 登陆</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <!--[if lt IE 9]>
    <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
    <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="/static/lib/layui-v2.5.4/css/layui.css" />
    <style>
        body {
            background-image: url("/static/images/bg.jpg");
            height: 100%;
            width: 100%;
        }

        #container {
            height: 100%;
            width: 100%;
        }

        input:-webkit-autofill {
            -webkit-box-shadow: inset 0 0 0 1000px #fff;
            background-color: transparent;
        }

        .admin-login-background {
            width: 300px;
            height: 300px;
            position: absolute;
            left: 50%;
            top: 40%;
            margin-left: -150px;
            margin-top: -100px;
        }

        .admin-header {
            text-align: center;
            margin-bottom: 20px;
            color: #ffffff;
            font-weight: bold;
            font-size: 40px
        }

        .admin-input {
            border-top-style: none;
            border-right-style: solid;
            border-bottom-style: solid;
            border-left-style: solid;
            height: 50px;
            width: 300px;
            padding-bottom: 0;
        }

        .admin-input::-webkit-input-placeholder {
            color: #a78369
        }

        .layui-icon-username {
            color: #a78369 !important;
        }

        .layui-icon-username:hover {
            color: #9dadce !important;
        }

        .layui-icon-password {
            color: #a78369 !important;
        }

        .layui-icon-password:hover {
            color: #9dadce !important;
        }

        .admin-input-username {
            border-top-style: solid;
            border-radius: 10px 10px 0 0;
        }

        .admin-input-verify {
            border-radius: 0 0 10px 10px;
        }

        .admin-button {
            margin-top: 20px;
            font-weight: bold;
            font-size: 18px;
            width: 300px;
            height: 50px;
            border-radius: 5px;
            background-color: #a78369;
            border: 1px solid #d8b29f
        }

        .admin-icon {
            margin-left: 260px;
            margin-top: 10px;
            font-size: 30px;
        }

        i {
            position: absolute;
        }

        .admin-captcha {
            position: absolute;
            margin-left: 205px;
            margin-top: -40px;
        }
    </style>
</head>
<body>
<div id="container">
    <div></div>
    <div class="admin-login-background">
        <div class="admin-header">
            <span>知识库管理</span>
        </div>
        <form class="layui-form" action="">
            <div>
                <i class="layui-icon layui-icon-username admin-icon"></i>
                <input type="text" name="username" placeholder="请输入用户名" autocomplete="off" class="layui-input admin-input admin-input-username"/>
            </div>
            <div>
                <i class="layui-icon layui-icon-password admin-icon"></i>
                <input type="password" name="password" placeholder="请输入密码" autocomplete="off" class="layui-input admin-input"/>
            </div>
            <div>
                <input type="text" name="captcha" placeholder="请输入验证码" autocomplete="off" class="layui-input admin-input admin-input-verify"/>
                <img class="admin-captcha" width="90" height="30" src="<?php echo url('/new_code'); ?>" alt="captcha" title="点击刷新" id="captcha_img" />
            </div>
            <button class="layui-btn admin-button" lay-submit="" lay-filter="login">登 陆</button>
        </form>
    </div>
</div>
<script type="text/javascript" src="/static/lib/layui-v2.5.4/layui.js"></script>
<script>
    layui.use(['form'], function () {
        const $ = layui.jquery,
            form = layui.form,
            layer = layui.layer;

        // 登录过期的时候，跳出ifram框架
        if (top.location != self.location) top.location = self.location;

        $('#captcha_img').on('click', function () {
            $(this).attr('src', '<?php echo url("/new_code"); ?>');
        });

        // 进行登录操作
        form.on('submit(login)', function (data) {
            data = data.field;
            if (data.username == '') {
                layer.msg('用户名不能为空');
                return false;
            }
            if (data.password == '') {
                layer.msg('密码不能为空');
                return false;
            }
            if (data.captcha == '') {
                layer.msg('验证码不能为空');
                return false;
            }

            $.ajax({
                type : "POST",
                dataType : "json",
                data : {
                    'user' : data
                },
                url : "/verify",
                success : function (res) {
                    console.log(res);
                    jres = JSON.parse(res);
                    if (!jres.succ) {
                        layer.msg(jres.msg);
                        $(':input[name="captcha"]').val('');
                        $('#captcha_img').attr('src', '<?php echo url("/new_code"); ?>');
                    } else {
                        window.location = jres.link;
                    }
                }
            });
            return false;
        });
    });
</script>
</body>
</html>