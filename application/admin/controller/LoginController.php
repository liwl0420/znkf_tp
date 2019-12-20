<?php
namespace app\admin\controller;

use app\common\controller\BaseController;
use app\common\model\UserModel;
use think\captcha\Captcha;
use think\Controller;
use think\facade\Log;
use think\facade\Session;

class LoginController extends Controller
{
    /**
     * 视图渲染
     * @return mixed
     */
    public function view()
    {
        if (Session::has('userinfo')) {
            $this->redirect('/admin');
        }
        return $this->fetch();
    }

    /**
     * 获取验证码
     * @return \think\Response
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

    /**
     * Ajax验证登陆
     * @return false|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function verify()
    {
        if (!$this->request->isAjax())
            $this->redirect('/login');

        $res = ['succ'=>false, 'msg'=>'', 'link'=>''];
        $data = input("user");
        Log::info('用户登陆信息:' . implode(',', $data));

        if (!captcha_check($data['captcha'])) {
            $res['msg'] = '验证码错误';
            return json_encode($res);
        }

        $login_user = UserModel::where('username=:name and password=:pwd')
            ->bind(['name' => $data['username'], 'pwd' => md5($data['password'])])
            ->field('id, username, nickname')
            ->find();
        if ($login_user == null) {
            $res['msg'] = '用户名或密码错误';
            return json_encode($res);
        }
        $res['succ'] = true;
        $res['link'] = '/admin';

        $session = $this->app['session'];
        if ($session->has('redirect_url')) {
            $res['link'] = $session->get('redirect_url');
        }

        $userinfo = [
            'id'       => $login_user['id'],
            'username' => $login_user['username'],
            'nickname' => $login_user['nickname'],
        ];
        Log::info('登陆成功:' . $userinfo['username']);
        Session::set('userinfo', $userinfo);
        Session::set('session_start_time', time());
        return json_encode($res);
    }

    public function logout()
    {
        if (Session::has('userinfo')) {
            Session::destroy();
        }
        $this->redirect('/login');
    }

}
