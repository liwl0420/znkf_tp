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

use think\facade\Route;

Route::get('/', 'index');  // 前台首页

Route::get('login', 'admin/login/view');
Route::get('new_code', 'admin/login/new_verify');
Route::post('verify', 'admin/login/verify');
Route::get('logout', 'admin/login/logout');
Route::get('admin', 'admin/index/index');

return [

];
