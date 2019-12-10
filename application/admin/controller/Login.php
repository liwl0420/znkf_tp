<?php
namespace app\admin\controller;

use think\captcha\Captcha;
use think\Controller;
use think\facade\Log;

class Login extends Controller
{
    public function view()
    {
        return $this->fetch();
    }

    /**
     * 获取新验证码
     * @return mixed
     */
    public function new_verify()
    {
        $config = [
            'length'   => 4,
            'expire'   => 300,
            'fontSize' => 30,
            'useNoise' => true,
            'useCurve' => false,
            'useImgBg' => false,
            'fontttf'  => '5.ttf'
        ];
        $captcha = new Captcha($config);
        return $captcha->entry();
    }

    public function verify()
    {
        $res = ['succ'=>0, 'msg'=>'', 'link'=>''];
        $data = input("user");
        Log::info($data);
        if (!captcha_check($data['captcha'])) {
            $res['msg'] = '登陆失败';
            return json_encode($res);
        }
        $res['succ'] = 1;
        $res['link'] = '/index';
        return json_encode($res);
    }

}
