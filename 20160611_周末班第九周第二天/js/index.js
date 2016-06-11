//->动态计算REM的换算比例
~function (desW) {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / desW * 100 + "px";
}(320);


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