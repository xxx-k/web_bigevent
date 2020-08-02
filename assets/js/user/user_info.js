$(function () {
    var form = layui.form
    var layer = layui.layer
    // 设置表单内容校验
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度需在1~6位"
            }
        }
    })
    initUserInfo()


    // 获取用户基本信息并渲染
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                // console.log(res)
                // 调用form.val快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮的点击事件
    $('.layui-form').on('reset', function (e) {
        e.preventDefault()

        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法重新渲染用户的头像和用户信息
                window.parent.getUserInfo()


            }
        })
    })

})