$(function () {
    // 点击“去注册账号”的链接
    $("#link_reg").on("click", function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $("#link_login").on("click", function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var layer = layui.layer;
    // 从layui中获取form对象
    var form = layui.form
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交默认事件
        e.preventDefault()
        // 向服务器发送请求
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function (res) {

            if (res.status !== 0) {
                layer.msg(res.message)
                return

            }
            layer.msg('注册成功')
            // 清空表单
            $('#form_reg')[0].reset()
            // 跳转回登陆页面
            // window.location.href = "http://127.0.0.1:5500/login.html"
            $('#link_login').click()
        })
    })

    //监听登录按钮的点击事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                }
                layer.msg('登录成功')
                // 将token存储到本地
                localStorage.setItem('token', res.token)
                // 成功登录后跳转到主页面
                location.href = "/index.html"

            }
        })
    })
})