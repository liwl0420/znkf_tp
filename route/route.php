<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

Route::get('/', 'index');  // 前台首页

Route::get('admin', 'admin/login/view');

Route::get('think', function () {
    return 'hello,ThinkPHP5sdf!';
});

Route::get('hello/:name', 'index/hello');

return [

];
