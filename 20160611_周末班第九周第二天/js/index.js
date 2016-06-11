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

//->动态计算REM的换算比例
~function (desW) {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(320);

//->操作头部导航
$(function () {
    var $header = $(".header"),
        $nav = $(".nav"),
        $navList = $nav.find("li");

    //->让中间一排导航默认是隐藏的
    var hideListAry = [];
    $navList.each(function (index, curLi) {
        if (index > 5 && index < 12) {
            $(curLi).css("display", "none");
            hideListAry.push(curLi);
        }
    });

    //->点击更多或者收起让中间一排显示或者隐藏
    $navList.filter(".btn").singleTap(function () {
        var _this = this,
            isBok = $(_this).attr("isBok");

        if (isBok === "block") {
            $.each(hideListAry, function (index, curLi) {
                $(curLi).css("display", "none");
            });
            $(_this).attr("isBok", "none").html("更多<span class='down'></span>");
            return;
        }

        $.each(hideListAry, function (index, curLi) {
            $(curLi).css("display", "block");
        });
        $(_this).attr("isBok", "block").html("收起<span class='up'></span>");
    });

    $header.children(".menu").singleTap(function () {
        var isBok = $nav.css("display");
        if (isBok === "block") {
            $nav.css("display", "none");
        } else {
            $nav.css("display", "block");
        }
    });
});

//->控制视频的自动播放
$(function () {
    window.setTimeout(function () {
        var myVideo = videojs("myVideo");
        myVideo.ready(function () {
            $("#myVideo").css({
                width: document.documentElement.clientWidth,
                height: parseFloat($(".videoBox").css("height"))
            });
            //this.play();
        });
    }, 1000);
});

//->JSONP数据请求,实现数据绑定
$(function () {
    var $match = $(".match"),
        $home = null,
        $away = null,
        $mid = null;

    //->计算比例
    function computedPress() {
        var leftNum = parseFloat($home.html());
        var rightNum = parseFloat($away.html());
        $mid[0].style.webkitTransition = "all 1s linear";
        var timer = window.setTimeout(function () {
            $mid[0].style.width = (leftNum / (leftNum + rightNum)) * 100 + "%";
            window.clearTimeout(timer);
        }, 100);
    }

    //->实现点击支持
    function support() {
        //->首先判断是否支持过
        var supportMatch = localStorage.getItem("supportMatch");
        if (supportMatch) {
            supportMatch = JSON.parse(supportMatch);
            supportMatch["support"] === "right" ? $away.addClass("bg") : $home.addClass("bg");
            $home.html(supportMatch["leftCount"]);
            $away.html(supportMatch["rightCount"]);
            computedPress();
            return;
        }

        //->没有支持过在绑定点击事件
        $home.singleTap(fn);
        $away.singleTap(fn);
        function fn() {
            if ($(this).attr("isClick") === "true") {
                return;
            }

            $(this).addClass("bg")
                .html(parseFloat($(this).html()) + 1);

            //->把需要的信息存储到本地
            var obj = {
                support: "left",
                leftCount: $home.html(),
                rightCount: $away.html()
            };
            if ($(this).hasClass("away")) {
                obj["support"] = "right";
            }
            localStorage.setItem("supportMatch", JSON.stringify(obj));

            //->点击一次后,需要移除点击操作
            $home.attr("isClick", "true");
            $away.attr("isClick", "true");

            computedPress();
        }
    }

    function bindHTML(matchData, matchInfo) {
        var str = '';
        //->TOP
        str += '<div class="top clear">';
        str += '<div class="home">';
        str += '<img src="' + matchInfo["leftBadge"] + '"/>';
        str += '<span>' + matchInfo["leftGoal"] + '</span>';
        str += '</div>';
        str += '<div class="time">' + matchInfo["startTime"].myFormatTime("{1}月{2}日 {3}:{4}") + '</div>';
        str += '<div class="away">';
        str += '<img src="' + matchInfo["rightBadge"] + '"/>';
        str += '<span>' + matchInfo["rightGoal"] + '</span>';
        str += '</div>';
        str += '</div>';
        //->MID
        str += '<div class="mid"><span></span></div>';
        //->BOT
        str += '<div class="bot">';
        str += '<div class="home">' + matchData["leftSupport"] + '</div>';
        str += '<div class="type">' + matchInfo["matchDesc"] + '</div>';
        str += '<div class="away">' + matchData["rightSupport"] + '</div>';
        str += '</div>';

        $match.html(str);
        $home = $(".bot>.home");
        $away = $(".bot>.away");
        $mid = $(".mid>span");
        computedPress();
    }

    function matchDetailCallback(jsonData) {
        if (jsonData && jsonData[1]) {
            var matchData = jsonData[1],
                matchInfo = matchData["matchInfo"];
            bindHTML(matchData, matchInfo);
            support();
        }
    }

    $.ajax({
        url: "http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531",
        type: "get",
        dataType: "jsonp",
        success: matchDetailCallback
    });
});

//->视频列表的数据绑定
$(function () {
    var $player = $(".player"),
        $wrapper = $player.children(".wrapper");
    var playerScroll;

    function bindHTML(data) {
        var str = '';
        $.each(data, function (index, curData) {
            index === 0 ? str += '<li class="bg">' : str += '<li>';
            str += '<div>';
            str += '<img src="' + curData["pic"] + '"/>';
            var time = "2016-06-11 " + curData["duration"];
            str += '<span>' + time.myFormatTime("{4}:{5}") + '</span>';
            str += '</div>';
            str += '<p>' + curData["title"] + '</p>';
            str += '</li>';
        });
        $wrapper.children("ul").css("width", data.length * 1.2 + "rem").html(str);
    }

    function matchStatsCallback(jsonData) {
        if (jsonData && jsonData[1]) {
            var stats = jsonData[1]["stats"], data = null;
            $.each(stats, function (index, item) {
                if (item["type"] == 9) {//->视频集锦
                    data = item["list"];
                }
            });
            bindHTML(data);

            //->实现本区域的局部滚动
            playerScroll = new IScroll("#wrapper", {
                scrollX: true,
                scrollY: false
            });
        }
    }

    $.ajax({
        url: "http://matchweb.sports.qq.com/html/matchStatV37?mid=100000:1468531",
        type: "get",
        dataType: "jsonp",
        success: matchStatsCallback
    });
});







