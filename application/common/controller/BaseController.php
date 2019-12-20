<?php


namespace app\common\controller;

use think\App;
use think\Controller;
use think\exception\HttpResponseException;
use think\facade\Session;

class BaseController extends Controller
{
    protected $userinfo;

    public function __construct(App $app = null)
    {
        parent::__construct($app);
        if (!Session::has('userinfo')) {
            $obj = redirect('/login')->remember();
            throw new HttpResponseException($obj);
        }

        if (time() - Session::get('session_start_time') > config('session.expire')) {
            Session::destroy();
            $obj = redirect('/login')->remember();
            throw new HttpResponseException($obj);
        }

        $this->userinfo = Session::get('userinfo');
    }
}