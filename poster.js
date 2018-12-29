const poster = require('./html2canvas')

function init(selector) {
    var containerDom = document.querySelector(selector)
    containerDom.innerHTML = `<input type="file" onchange="uploadFile(this)"><input type="file" onchange="uploadFile(this)"><div id="boxQR"></div>`
}

const uploadFile = function (obj) {
    //获取file对象
    // console.log(obj.files[0])
    var file = obj.files[0];
    //创建FileReader对象
    var fr = new FileReader();
    //判断文件的类型
    if (file.type.match(/^image\//) !== null) {
        //读取图片
        readImage(fr, file);
    } else {
        alert("你上传的文件格式不是图片格式");
    }
}
/**
 * 读取图片
 * @param FileReader  frObj 
 * @param File  fileObj 
 */
const readImage = function (frObj, fileObj) {
    frObj.onload = function () {
        var img = document.createElement("img");
        img.src = frObj.result;
        document.querySelector("#boxQR").appendChild(img);
    }
    frObj.readAsDataURL(fileObj);
}
module.exports = init