<?php
namespace app\admin\controller;

use app\common\controller\Base;
use think\facade\Log;
use think\facade\Session;

class Index extends Base
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

    public function hello($name = 'ThinkPHP5')
    {
        return 'hello,' . $name;
    }
}
