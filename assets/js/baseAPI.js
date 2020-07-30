// 拦截器（过滤器）
// 每次调用$.ajax $.get $.post的时候会先调用ajaxPrefilter这个函数，在这个函数中，我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})