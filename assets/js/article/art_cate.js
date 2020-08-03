$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 封装获取文章列表的函数
    function initArtCateList() {
        // 发起ajax请求获取文章列表数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log(res)
                // 调用模板引擎，接收返回值
                var htmlStr = template('tpl-table', res)
                // 渲染到页面
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加类别按钮点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {

        indexAdd = layer.open({
            // 设置弹出层类型
            type: 1,
            // 弹出层标题
            title: '添加文章分类',
            // 弹出层内容
            content: $('#dialog-add').html(),
            // 设置弹出层宽高 
            area: ['500px', '250px']
        })
    })
    // 通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-edit按钮设置点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            // 设置弹出层类型
            type: 1,
            // 弹出层标题
            title: '修改文章分类',
            // 弹出层内容
            content: $('#dialog-edit').html(),
            // 设置弹出层宽高 
            area: ['500px', '250px']
        })
        // 获取当前点击的分类的id
        var id = $(this).attr('data-id')
        // 发起请求
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                // 给表单快速填充数据
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败')
                }
                initArtCateList()
                layer.msg('修改分类成功')
                layer.close(indexEdit)
            }
        })
    })

    // 通过代理的形式为btn-del按钮设置点击事件
    $('tbody').on('click', '.btn-del', function () {


        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 发起请求
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()

                }
            })

        });

    })
})