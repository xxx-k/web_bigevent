$(function () {
    getUserInfo()
    var layer = layui.layer
    // 设置退出的点击事件,实现弹出窗提示并清空本地token和重定向
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认推出
        layer.confirm('确定退出登录吗', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 点击确定后执行的

            // 关闭confirm提示框
            layer.close(index);
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重定向 跳转到登陆页面
            window.location.href = '/login.html'

        });
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 请求头配置对象
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            // console.log(res)
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data)

        }
        /* ,
        // 无论成功还是失败,最终都会调用complete回调函数
                complete: function (res) {
                // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
                    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
                    // 强制清空token
                        localStorage.removeItem('token')
                        // 强制跳转到登录页面
                        location.href = "/login.html"

                    }
                } */
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    // 判断 有图片头像则用图片头像 否则使用文字头像
    var name = user.nickname || user.username
    // 拼接渲染
    $('#welcome').html('欢迎&nbsp;' + name)
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        // 隐藏文字头像
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        // 隐藏图片头像
        $('.layui-nav-img').hide()
        // 获取用户名第一个字母并转为大写
        var first = name[0].toUpperCase()
        // 渲染显示
        $('.text-avatar').html('first').show()
    }
}