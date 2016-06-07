~function (pro) {
    //myTrim:Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub:Intercept string, this method is distinguished in English
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime:Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?: +)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日{3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter:Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
}(String.prototype);

//->IScroll实现MATCH区域的局部滚动:MATCH区域下需要有一个总的DIV,IScroll是给MATCH下第一个子元素中的内容进行局部滚动设置的；想让滚动条在MATCH区域显示的话,需要给MATCH区域增加“position: relative”
var $myScroll = new IScroll("#match", {
    mouseWheel: true,//->是否支持鼠标滚轮滚动,默认是FALSE
    scrollbars: true,//->是否显示滚动条,默认是FALSE
    bounce: false,//->是否支持到达边界缓冲,默认是TRUE
    momentum: false//->关闭势能缓冲动画(关闭后提高处理的性能)
    //useTransform: true,
    //useTransition: false,//->设置使用css3动画来实现滚动
    //tap: false,//->是否允许用户在点击里面的内容
    //bounce: false
    //bounceEasing: 'elastic',
    //bounceTime: 1200//->到边界后是否有缓冲的动画
});

//->计算MATCH区域的高度 && 当屏幕窗口的尺寸发生改变的时候,让MATCH区域的高度也随之变化
var $match = $(".match"), winH = null;
$(window).on("load resize", function () {
    winH = document.documentElement.clientHeight || document.body.clientHeight;
    $match.css("height", winH - 40 - 82);

    //->当MATCH区域的高度发生改变我们需要让设置的局部滚动进行刷新
    $myScroll.refresh();
});

//->进行CALENDAR区域的数据请求,我们在请求成功数据后需要做的事情比较多,我们可以使用“发布订阅模式”进行回调函数的订阅
var $calendarCallBackList = $.Callbacks();
function calendarBind(jsonData) {
    if (jsonData && jsonData["data"]) {
        var tempData = jsonData["data"],
            today = tempData["today"],
            data = tempData["data"];
        $calendarCallBackList.fire(today, data);
    }
}
$.ajax({
    url: "http://matchweb.sports.qq.com/kbs/calendar?columnId=100000",
    type: "get",
    dataType: "jsonp",
    jsonpCallback: "calendarBind"
});

//->开始CALENDAR区域的数据绑定
var $calendarList = $(".calendarList>ul"),
    minL = 0,
    maxL = 0;
$calendarCallBackList.add(function (today, data) {
    var str = '';
    $.each(data, function (index, curData) {
        str += '<li>';
        str += '<span class="week">' + curData["weekday"] + '</span>';
        str += '<span class="date">' + curData["date"].myFormatTime("{1}-{2}") + '</span>';
        str += '</li>';
    });
    $calendarList.html(str).css("width", data.length * 105);

    //->计算最小的LEFT的值
    minL = -((data.length - 7) * 105);
});

//->开始CALENDAR区域的日期定位:开始的时候定位到当前的日期
$calendarCallBackList.add(function (today, data) {



});











