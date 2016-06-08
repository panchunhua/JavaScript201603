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

var $myScroll = new IScroll("#match", {
    mouseWheel: true,
    scrollbars: true,
    bounce: false,
    momentum: false
});

//->计算MATCH区域的高度
var $match = $(".match"), winH = null;
$(window).on("load resize", function () {
    winH = document.documentElement.clientHeight || document.body.clientHeight;
    $match.css("height", winH - 40 - 82);
    $myScroll.refresh();
});

//->进行CALENDAR区域的数据请求
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
var $calendarUL = $(".calendarList>ul"),
    minL = 0,
    maxL = 0;
$calendarCallBackList.add(function (today, data) {
    var str = '';
    $.each(data, function (index, curData) {
        str += '<li time="' + curData["date"] + '">';
        str += '<span class="week">' + curData["weekday"] + '</span>';
        str += '<span class="date">' + curData["date"].myFormatTime("{1}-{2}") + '</span>';
        str += '</li>';
    });
    $calendarUL.html(str).css("width", data.length * 105);
    minL = -((data.length - 7) * 105);
});

//->开始CALENDAR区域的日期定位:开始的时候定位到当前的日期
var $calendarList = null;
$calendarCallBackList.add(function (today, data) {
    $calendarList = $calendarUL.children("li");
    //->根据当前日期获取到具体的LI
    var $curTime = $calendarList.filter("[time='" + today + "']");
    //->如果当前日期在LI中并不存在,我们找到其后面最靠近的一个:从第一个LI开始查找,直到遇到一个LI存储的日期比我们当前日期大的结束查找
    if ($curTime.length === 0) {
        for (var i = 0; i < $calendarList.length; i++) {
            var $curLi = $calendarList.eq(i);
            var n = new Date($curLi.attr("time").replace(/-/g, "/"));//->每一次循环找到的LI中的日期
            var m = new Date(today.replace(/-/g, "/"));//->当前日期
            if ((n - m) > 0) {
                $curTime = $curLi;
                break;
            }
        }
    }
    //->如果找了一圈还没有我们则显示最后一个即可
    if ($curTime.length === 0) {
        $curTime = $calendarList.filter(":last");
    }

    //->定位到当前$curTime这个位置,这个位置处于7个LI的中间位置:但是到达边界还需要做一个判断
    var curL = -($curTime.index() * 105) + (3 * 105);
    curL = curL < minL ? minL : (curL > maxL ? maxL : curL);

    $curTime.addClass("bg");
    $calendarUL.css("left", curL);

    //->开始读取比赛数据,进行数据绑定
    bindMatch();

    //->定位到指定位置
    window.setTimeout(function () {
        positionElement($curTime.attr("time"));
    }, 300);
});

//->使用事件委托实现CALENDAR区域的点击操作
$(".calendar").on("click", function (ev) {
    var tar = ev.target,
        $tar = $(tar),
        $parents = $tar.parents();
    $parents = $parents.add(tar);//->使用ADD向集合中增加新元素,原始集合默认是不会发生改变的,它会形成一个新的集合返回

    //->左按钮:让整个UL区域向右移动七个LI的位置
    //->右按钮:让整个UL区域向左移动七个LI的位置
    var tarLeft = null;
    if ($parents.hasClass("left") || $parents.hasClass("right")) {
        if ($calendarUL.attr("isMove") === "true") {
            return;
        }
        if ($parents.hasClass("left")) {
            tarLeft = parseFloat($calendarUL.css("left")) + 7 * 105;
            tarLeft = tarLeft > maxL ? maxL : tarLeft;
        } else {
            tarLeft = parseFloat($calendarUL.css("left")) - 7 * 105;
            tarLeft = tarLeft < minL ? minL : tarLeft;
        }
        $calendarUL.attr("isMove", true).stop().animate({left: tarLeft}, 500, function () {
            $(this).attr("isMove", false);

            //->每一次切换结束,让当前区域第一个默认被选中
            var tarIndex = Math.abs(parseFloat($(this).css("left"))) / 105;
            $calendarList.eq(tarIndex).addClass("bg").siblings().removeClass("bg");

            //->重新绑定比赛区域的数据
            bindMatch();

            //->回归顶部
            $myScroll.scrollTo(0, 0);
        });
        return;
    }

    //->LI:让当前的有选中样式,而其余的移除选中样式
    var $curLi = $parents.filter("li");
    if ($curLi.length > 0) {
        $curLi.addClass("bg").siblings().removeClass("bg");
        positionElement($curLi.attr("time"));
    }
});

//->开始处理和绑定MATCH区域的操作
function positionElement(time) {
    var $pos = $match.find(".matchDate[time='" + time + "']");
    if ($pos.length > 0) {
        $myScroll.scrollToElement($pos[0], 500);
    }
}
function gameList(jsonData) {
    var str = '';
    if (jsonData) {
        var data = jsonData["data"];
        $.each(data, function (key, curAry) {
            str += '<div class="matchDate" time="' + key + '">';
            str += '<h2 class="date">' + key.myFormatTime("{1}月{2}日") + '</h2>';
            str += '<ul class="matchList">';
            $.each(curAry, function (index, curData) {
                var linkURL;
                str += '<li>';
                str += '<div class="left">';
                str += '<span class="time">' + curData["startTime"].myFormatTime("{3}:{4}") + '</span>';
                str += '<span class="type">' + curData["matchDesc"] + '</span>';
                str += '</div>';
                str += '<div class="middle">';
                linkURL = "http://kbs.sports.qq.com/kbsweb/teams.htm?tid=" + curData["leftId"] + "&cid=" + curData["competitionId"];
                str += '<a href="' + linkURL + '" target="_blank" class="home">';
                str += '<img src="' + curData["leftBadge"] + '"/>';
                str += '<span>' + curData["leftName"] + '</span>';
                str += '</a>';
                str += '<div class="score">' + curData["leftGoal"] + '-' + curData["rightGoal"] + '</div>';
                linkURL = "http://kbs.sports.qq.com/kbsweb/teams.htm?tid=" + curData["rightId"] + "&cid=" + curData["competitionId"];
                str += '<a href="' + linkURL + '" target="_blank" class="away">';
                str += '<img src="' + curData["rightBadge"] + '"/>';
                str += '<span>' + curData["rightName"] + '</span>';
                str += '</a>';
                str += '</div>';
                str += '<div class="right">';
                linkURL = "http://kbs.sports.qq.com/kbsweb/game.htm?mid=" + curData["mid"];
                str += '<a href="' + linkURL + '" target="_blank" class="video">视频集锦</a>';
                str += '<a href="' + linkURL + '&replay=1" target="_blank" class="playBack">比赛回放</a>';
                str += '</div>';
                str += '</li>';
            });
            str += '</ul>';
            str += '</div>';
        });
    }
    $match.children("div").eq(0).html(str);
    $myScroll.refresh();
}
function bindMatch() {
    var strIn = Math.abs(parseFloat($calendarUL.css("left"))) / 105,
        endIn = strIn + 6;
    var strTime = $calendarList.eq(strIn).attr("time"),
        endTime = $calendarList.eq(endIn).attr("time");

    $.ajax({
        url: "http://matchweb.sports.qq.com/kbs/list?columnId=100000&startTime=" + strTime + "&endTime=" + endTime,
        type: "get",
        dataType: "jsonp",
        jsonpCallback: "gameList"
    });
}