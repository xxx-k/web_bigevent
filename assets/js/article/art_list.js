$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 定义layui的laypage属性 用于渲染分页结构
    var laypage = layui.laypage;
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + "-" + m + "-" + d + "" + hh + ":" + mm + ":" + ss;
    };

    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }

    // 定义一个查询参数对象，将来请求数据的时候需要将请求参数提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: "", //文章分类的ID
        state: "", //文章发布的状态
    };
    initTable();
    initCate();
    // 渲染页面
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章获取失败");
                }
                // 使用模板引擎渲染页面数据
                var html = template("tpl-table", res);
                $("tbody").html(html);
                //   调用渲染分页方法，将文章总条数传进去
                renderPage(res.total);
            },
        });
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                // 调用模板引擎渲染分类可选项
                var str = template("tpl-cate", res);
                $("[name=cate_id]").html(str);
                // 通知layui重新渲染表单区域的UI结构
                form.render();
            },
        });
    }
    // 为筛选表单绑定submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        // 未查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render（）方法来设置分页结构
        laypage.render({
            elem: "pageBox", //分页的容器
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中的分页
            limits: [2, 3, 5, 10],
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            // 分页发生切换的时候执行的回调函数
            //   触发jump回调的方式有两种
            //   1.点击页码的时候
            //   2.只要调用laypage.render（）方法就会触发
            jump: function (obj, first) {
                //将当前点击的页码值赋值给q.pagenum
                q.pagenum = obj.curr;
                //   把最新的条目数赋值给p.pagesize
                q.pagesize = obj.limit;
                // console.log(first);

                //通过first的值来判断jupm的触发方式
                //   1.如果值为true则为方式2触发
                //   2.undefined则为方式1触发
                if (!first) {
                    // 根据最新的q获取对应的数据列表，并渲染表格
                    initTable();
                }
            },
        });
    }

    // 通过代理的形式为删除按钮绑定点击事件
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
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据
                    // 如果没有则让页码值-1
                    // 再重新调用initTable()
                    $('.btn-del').length === 1 && q.pagenum > 1 && q.pagenum--

                    initTable()
                    layer.close(index);

                }
            })

        });
    })

    // 修改页面跳转
    $('tbody').on('click', '.btn-edit', function () {
        var Id = $(this).attr('data-id')
        // console.log("/article/art_edit.html?id=" + Id)
        //页面跳转的时候要携带文章的id，到文章修改页面通过id过去文章详细信息
        location.href = "/article/art_edit.html?id=" + Id
    })
});