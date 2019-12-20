<?php

namespace app\admin\controller;

use app\common\controller\BaseController;
use app\common\model\TagsModel;
use think\Request;

class TagsController extends BaseController
{
    /**
     * 显示资源列表
     *
     * @return \think\Response
     */
    public function index()
    {
        //
        return $this->fetch();
    }

    /**
     * @return \think\response\Json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function getAll()
    {
        $page = \think\facade\Request::param('page', '1');
        $limit = \think\facade\Request::param('limit', '10');
        $search = \think\facade\Request::param('search', null);

        $data = empty($search) ?
            TagsModel::order('createtime', 'desc')->paginate(intval($limit), false, ['page' => intval($page)])
            : TagsModel::where('name', 'like', '%' . $search . '%')
                ->order('createtime', 'desc')->paginate(intval($limit), false, ['page' => intval($page)]);
        if ($data->isEmpty())
            $res = ['code' => 0, 'msg' => '', 'count' => 0, 'data' => []];
        else {
            $count = $data->total();
            $res = ['code' => 0, 'msg' => '', 'count' => $count, 'data' => $data->items()];
        }
        return json($res);
    }

    /**
     * 显示创建资源表单页.
     *
     * @return \think\Response
     */
    public function create()
    {
        //
    }

    /**
     * 保存新建的资源
     *
     * @param  \think\Request  $request
     * @return \think\Response
     */
    public function save(Request $request)
    {
        //
    }

    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read($id)
    {
        //
    }

    /**
     * 显示编辑资源表单页.
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * 保存更新的资源
     *
     * @param  \think\Request  $request
     * @param  int  $id
     * @return \think\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * 删除指定资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function delete($id)
    {
        //
    }
}
