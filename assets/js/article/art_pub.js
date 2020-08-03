$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 渲染文章类型下拉列表
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章类别获取失败')
                }
                var str = template('select', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()

    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var file = e.target.files[0]
        // console.log(file)
        // 判断用户是否选择了文件
        if (e.target.files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 设置按钮（存为草稿）的点击事件 
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData(this)
        // 将文章的发布状态存到id中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                // console.log(...fd)
                $.ajax({
                    method: 'post',
                    url: '/my/article/add',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        layer.msg('文章发送成功')
                        location.href = "/article/art_list.html"
                        window.parent.document.getElementById('a1').className = 'layui-this';
                        window.parent.document.getElementById('a2').className = '';

                    }
                })

            })
    })
})