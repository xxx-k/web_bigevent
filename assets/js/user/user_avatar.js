$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件框绑定change事件
    $('#file').on('change', function (e) {
        var fileList = e.target.files
        // console.log(fileList)
        if (fileList.length === 0) {
            return layer.msg('请选择照片')
        }
        var file = e.target.files[0]
        // 获取当前文件的内存URL
        var imgURL = URL.createObjectURL(file)
        // console.log(imgURL)
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    })

    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 获取裁剪后的图片，获取到的是base64格式的字符串
        // base64格式的图片可以直接渲染，节省请求，但是体积较大越增大30%
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // 发送请求上传头像
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败')
                }
                layer.msg('更新头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})