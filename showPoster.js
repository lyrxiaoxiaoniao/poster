// var style = require("./showPoster.css");

;(function (undefined) {
    var _global;
    //工具函数 配置合并 类似继承
    function extend(def, opt, override) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
                def[k] = opt[k]
            }
        }
        return def;
    }
    // 构造函数
    function showPoster(opt) {
        // 初始化海报
        var def = {},
            opt = extend(def, opt, true),
            el = document.querySelector(opt.el) || document.querySelector('body'),
            _this = this;

        var init = function () {
            rendder();
            bindEvent();
        }
        // 绑定事件
        var bindEvent = function () {
            document.querySelector("#test").addEventListener('change',function(e){
                uploadFile(e.currentTarget)
            },false)
        }
        // 渲染函数
        var rendder = function () {
            el.innerHTML = `<input id="test" type="file"><div id="boxQR"></div>`
        }
        // 获取图片函数
        var uploadFile = function (obj) {
            //获取file对象
            console.log(obj.files[0])
            var file = obj.files[0];
            //创建FileReader对象
            var fr = new FileReader();
            //判断文件的类型
            if (file.type.match(/^image\//) !== null) {
                //读取图片
                readBgImage(fr, file);
            } else {
                alert("你上传的文件格式不是图片格式");
                // throw new Error("你上传的文件格式不是图片格式");
            }
        }
        /**
         * 读取图片，插入
         * @param FileReader  frObj
         * @param File  fileObj
         */
        var readBgImage = function (frObj, fileObj) {
            frObj.onload = function () {
                var img = document.createElement("img");
                img.src = frObj.result;
                document.querySelector("#boxQR").appendChild(img);
            }
            frObj.readAsDataURL(fileObj);
        }
        init()
    }

    // 将插件暴露给全局对象
    _global = (function () {
        return this || (0, eval)('this')
    }());
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = showPoster;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return showPoster;
        })
    } else {
        !('showPoster' in _global) && (_global.showPoster = showPoster);
    }
}());