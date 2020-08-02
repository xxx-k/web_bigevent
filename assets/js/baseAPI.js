// 拦截器（过滤器）
// 每次调用$.ajax $.get $.post的时候会先调用ajaxPrefilter这个函数，在这个函数中，我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 同意为有权限的接口设置headers请求头
    // 判断当前发起的请求是否需要权限(请求路径是否包含 /my/)
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }
    // 全局统一挂载complete回调函数
    options.complete = function (res) {
        // console.log(res.responseJSON)
        // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = "/login.html"

        }
    }

})