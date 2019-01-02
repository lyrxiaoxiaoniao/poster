(function () {
    // 默认参数
    var _options = {
        default_title: 'default title'
    }
    // 定义api
    var _plugin_api = {
        firstFunc: function (str = _options.default_title) {
            console.log(str, 'firstFunc')
            return this
        },
        secondFunc: function () {
            console.log('secondFunc')
            return this
        }
    }
    this.TSPlugin = _plugin_api;
})()