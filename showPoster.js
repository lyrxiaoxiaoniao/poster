var style = require("./showPoster.css");
var html2canvas = require("./js/html2canvas.js");
// console.log(html2canvas)
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
            drag(document.querySelector("#qr-drag"));
        }
        // 绑定事件
        var bindEvent = function () {
            document.querySelector("#bgPoster").addEventListener('change', function (e) {
                uploadFile(e.currentTarget, 'bg')
            }, false)
            document.querySelector("#qrPoster").addEventListener('change', function (e) {
                uploadFile(e.currentTarget, 'qr')
            }, false)
            document.querySelector("#downloadPoster").addEventListener('click', function (e) {
                downloadPoster()
            }, false)
        }
        // 渲染函数
        var rendder = function () {
            el.innerHTML = `
            <div class="${style.container}">
                <div class="${style.upload}">
                    <div class="${style['upload-button']}">
                        <span>上传背景</span>
                        <input id="bgPoster" type="file">
                    </div>
                    <div class="${style['upload-button']}">
                        <span>上传二维码</span>
                        <input id="qrPoster" type="file">
                    </div>
                    <div class="${style['upload-button']}">
                        <span id="downloadPoster">下载海报</span>
                    </div>
                </div>
                <div id="capture" class="${style.poster}">
                    <img id="qr-drag" class="${style['poster-qr']} draggable" style="position: absolute;left:0;top:0;width: 66px;height:66px;" src="http://placehold.it/66x66/999696/ffffff">
                    <img id="poster-bg" class="${style['poster-bg']}" src="http://placehold.it/320x640/F44C41/ffffff">
                </div>
            </div>`
        }
        // 获取图片函数
        var uploadFile = function (obj, type) {
            //获取file对象
            console.log(obj.files[0])
            var file = obj.files[0];
            //创建FileReader对象
            var fr = new FileReader();
            //判断文件的类型
            if (file.type.match(/^image\//) !== null) {
                //读取图片
                readImage(fr, file, type);
            } else {
                alert("你上传的文件格式不是图片格式");
            }
        }
        /**
         * 读取图片，插入
         * @param FileReader  frObj
         * @param File  fileObj
         */
        var readImage = function (frObj, fileObj, type) {
            frObj.onload = function () {
                var img;
                if (type === 'bg') {
                    img = document.querySelector('#poster-bg');
                } else if (type === 'qr') {
                    img = document.querySelector('#qr-drag');
                }
                img.src = frObj.result;
            }
            frObj.readAsDataURL(fileObj);
        }
        var downloadPoster = function () {
            html2canvas(document.querySelector("#capture"), {
                scale: 2
            }).then(canvas => {
                el.appendChild(canvas)
            });
        }
        init()
    }
    // -------------------------------------------拖拽-----------------------------------------
    // region dom方法
    var dom = {
        on: function (node, eventName, handler) {
            if (node.addEventListener) {
                node.addEventListener(eventName, handler);
            } else {
                node.attachEvent("on" + eventName, handler);
            }
            return this;
        },
        off: function (node, eventName, handler) {
            if (node.removeEventListener) {
                node.removeEventListener(eventName, handler);
            } else {
                node.detachEvent("on" + eventName, handler);
            }
            return this;
        },
        getStyle: function (node, styleName) {
            var realStyle = null;
            if (window.getComputedStyle) {
                realStyle = window.getComputedStyle(node, null)[styleName];
            } else if (node.currentStyle) {
                realStyle = node.currentStyle[styleName];
            }
            return realStyle;
        },
        setCss: function (node, css) {
            for (var key in css) {
                node.style[key] = css[key];
            }
            return this;
        }
    };
    // endregion

    // region 拖拽元素类
    function DragElement(node) {
        this.target = node;

        node.onselectstart = function () {
            //防止拖拽对象内的文字被选中
            return false;
        }
    }
    DragElement.prototype = {
        constructor: DragElement,
        setXY: function (x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this;
        },
        setTargetCss: function (css) {
            dom.setCss(this.target, css);
            return this;
        }
    }
    // endregion

    // region 鼠标元素
    function Mouse() {
        this.x = 0;
        this.y = 0;
    }
    Mouse.prototype.setXY = function (x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }
    // endregion

    //拖拽配置
    var draggableConfig = {
        zIndex: 1,
        dragElement: null,
        mouse: new Mouse()
    };

    var draggableStyle = {
        dragging: {
            cursor: "move"
        },
        defaults: {
            cursor: "default"
        }
    }

    function drag(ele) {
        var dragNode = (ele.querySelector(".draggable") || ele);
        dom.on(dragNode, "mousedown", function (event) {
            var dragElement = draggableConfig.dragElement = new DragElement(ele);

            draggableConfig.mouse.setXY(event.clientX, event.clientY);
            draggableConfig.dragElement
                .setXY(dragElement.target.style.left, dragElement.target.style.top)
                .setTargetCss({
                    "zIndex": draggableConfig.zIndex++,
                    "position": "absolute"
                });
        }).on(dragNode, "mouseover", function () {
            dom.setCss(this, draggableStyle.dragging);
        }).on(dragNode, "mouseout", function () {
            dom.setCss(this, draggableStyle.defaults);
        });
    }

    function move(event) {
        if (draggableConfig.dragElement) {
            var mouse = draggableConfig.mouse,
                dragElement = draggableConfig.dragElement;
            dragElement.setTargetCss({
                "left": parseInt(event.clientX - mouse.x + dragElement.x) + "px",
                "top": parseInt(event.clientY - mouse.y + dragElement.y) + "px"
            });

            dom.off(document, "mousemove", move);
            setTimeout(function () {
                dom.on(document, "mousemove", move);
            }, 25);
        }
    }

    dom.on(document, "mousemove", move);

    dom.on(document, "mouseup", function (event) {
        draggableConfig.dragElement = null;
    })
    // ------------------------------------------------------------------------------------
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