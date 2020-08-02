$(function () {
    var form = layui.form
    // 设置表单内容校验
    form.verify({
        // 密码长度设制
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不相同'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('更改密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})