<?php
namespace app\admin\controller;

use app\common\controller\BaseController;
use think\facade\Log;
use think\facade\Session;

/**
 * 前台首页
 * @package app\admin\controller
 */
class IndexController extends BaseController
{
    /**
     * 视图渲染
     * @return mixed
     */
    public function index()
    {
//        Session::clear();
        $this->assign('userinfo', $this->userinfo);
        return $this->fetch('/index');
    }

    public function home()
    {
        return $this->fetch();
    }
}
